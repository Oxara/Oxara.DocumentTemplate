import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { access, copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import {renderThemeColors} from './theme-colors.mjs';
import {pathToFileURL} from 'node:url';
import {validateBrandWebTheme} from './brand-web-theme.mjs';

const consumerRoot = path.resolve(import.meta.dirname, '..');
const brandRoot = path.resolve(process.env.OXARA_BRAND_HOME || path.join(consumerRoot, '..', 'Oxara.Brand'));
const checkOnly = process.argv.includes('--check');
const profileId = 'document-template-web';
const exportRoot = path.join(brandRoot, 'exports', profileId);
const manifestPath = path.join(exportRoot, 'manifest.json');
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

await access(manifestPath);
const manifestBytes = await readFile(manifestPath);
const manifest = JSON.parse(manifestBytes);
if (manifest.profile !== profileId || manifest.consumer !== 'Oxara.DocumentTemplate') throw new Error('Unexpected Brand consumer manifest.');
if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(manifest.profileVersion || '')) throw new Error('Brand consumer manifest requires an explicit profileVersion.');

for (const [hashKey, pathKey] of [
  ['geometrySourceSha256', 'geometrySource'],
  ['registrySha256', 'registry'],
  ['profileSha256', 'profile'],
  ['generatorSourceSha256', 'generatorSource'],
  ['tokenSourceSha256', 'tokenSource'],
  ['webActionSourceSha256', 'webActionSource'],
  ['companionSourceSha256', 'companionSource'],
  ['webActionResolverSourceSha256', 'webActionResolverSource']
]) {
  const relativePath = manifest.inputs?.[pathKey];
  const expected = manifest.inputs?.[hashKey];
  if (typeof relativePath !== 'string' || typeof expected !== 'string') throw new Error(`Missing manifest provenance: ${pathKey}/${hashKey}`);
  if (sha256(await readFile(path.join(brandRoot, relativePath))) !== expected) throw new Error(`Stale Brand manifest input: ${relativePath}`);
}

for (const [key, expectedPath] of Object.entries({webActionSource:'assets/tokens/web-actions.json',companionSource:'assets/tokens/companion-colors.json',webActionResolverSource:'scripts/lib/web-action-tokens.mjs'})) {
  if (manifest.inputs[key] !== expectedPath) throw Error('Unexpected canonical Brand web input: ' + key);
}
// Resolve only after all source hashes and canonical paths have been verified.
const {loadWebActionTokens} = await import(pathToFileURL(path.join(brandRoot, manifest.inputs.webActionResolverSource)).href);
const resolvedWeb = await loadWebActionTokens(brandRoot);
for (const [key, value] of Object.entries(resolvedWeb.inputs)) {
  if (manifest.inputs[key] !== value) throw Error("Brand web source changed during validation: " + key);
}
const sourceProfile = JSON.parse(await readFile(path.join(brandRoot, manifest.inputs.profile), 'utf8'));
const {primaryContrast, hoverContrast} = validateBrandWebTheme(manifest, sourceProfile, resolvedWeb);
const theme = manifest.consumerTheme;
for (const key of ['brand', 'brandLight', 'primaryBackground', 'primaryHover', 'primaryForeground']) {
  if (!/^#[0-9A-F]{6}$/.test(theme?.[key] || '')) throw new Error(`Invalid consumerTheme.${key}`);
}
const changes = [];
const themePath=path.join(consumerRoot,'features/base/theme-colors.css');
const expectedTheme=await renderThemeColors(theme);
let currentTheme='';try{currentTheme=await readFile(themePath,'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}
if(currentTheme!==expectedTheme){changes.push('features/base/theme-colors.css');if(!checkOnly)await writeFile(themePath,expectedTheme);}
for (const output of manifest.outputs) {
  const source = path.join(exportRoot, output.path);
  const bytes = await readFile(source);
  if (sha256(bytes) !== output.sha256) throw new Error(`Brand export hash mismatch: ${output.path}`);
  if (!output.consumerDestination) continue;
  const destination = path.join(consumerRoot, output.consumerDestination);
  let currentHash = null;
  try { currentHash = sha256(await readFile(destination)); } catch {}
  if (currentHash === output.sha256) continue;
  changes.push(output.consumerDestination);
  if (!checkOnly) {
    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
  }
}

const evidencePath = path.join(consumerRoot, 'docs', 'BRAND-COMPATIBILITY.evidence.json');
const evidenceSource = await readFile(evidencePath, 'utf8');
const evidence = JSON.parse(evidenceSource);
const nextContractSha256 = sha256(await readFile(path.resolve(path.dirname(evidencePath), evidence.brandComplianceProfile.contractPath)));
const nextProfileSha256 = sha256(await readFile(path.resolve(path.dirname(evidencePath), evidence.brandComplianceProfile.profilePath)));
const nextManifestSha256 = sha256(manifestBytes);
const provenanceUnchanged = evidence.brandComplianceProfile.contractSha256 === nextContractSha256
  && evidence.brandComplianceProfile.profileSha256 === nextProfileSha256
  && evidence.brandComplianceProfile.manifestSha256 === nextManifestSha256;
const approvalPreserved = provenanceUnchanged && evidence.workflow?.userApproval === 'approved';
const changedTracked = execFileSync('git', ['diff', '--name-only', 'HEAD', '--'], { cwd: consumerRoot, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
const changedUntracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: consumerRoot, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
// Evidence describes source changes, not private records or historical generated graphs.
const sourceBoundary = file => !/^(?:work|\.planning|dist|node_modules|assets\/docs-runtime)\//.test(file);
const actualChangedFiles = new Set([...changedTracked, ...changedUntracked].map(file => file.replaceAll('\\', '/')).filter(sourceBoundary));
const changeKinds = new Map(changedUntracked.map(file => [file.replaceAll('\\', '/'), 'add']));
for (const line of execFileSync('git', ['diff', '--name-status', 'HEAD', '--'], { cwd: consumerRoot, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean)) {
  const [status, ...paths] = line.split('\t');
  const repoPath = (status.startsWith('R') ? paths.at(-1) : paths[0]).replaceAll('\\', '/');
  changeKinds.set(repoPath, status.startsWith('A') ? 'add' : status.startsWith('D') ? 'delete' : status.startsWith('R') ? 'rename' : 'modify');
}
if (!checkOnly) evidence.applicationBoundary.changedFiles = [...actualChangedFiles].sort();
delete evidence.workflow.devkitAudit;
evidence.$schema='../tools/release-checks/schemas/brand-evidence.schema.json';
evidence.workflow.auditEngine='document-template-release-checks';
evidence.workflow.legacyDevkitAudit='not-available';
const contractRelativePath = evidence.brandComplianceProfile.contractPath;
const profileRelativePath = evidence.brandComplianceProfile.profilePath;
evidence.brandComplianceProfile.contractSha256 = nextContractSha256;
evidence.brandComplianceProfile.profileSha256 = nextProfileSha256;
evidence.brandComplianceProfile.manifestSha256 = nextManifestSha256;
evidence.brandComplianceProfile.profileVersion = manifest.profileVersion;
evidence.media.profileSha256 = evidence.brandComplianceProfile.profileSha256;
evidence.media.manifestSha256 = evidence.brandComplianceProfile.manifestSha256;
evidence.media.profileVersion = manifest.profileVersion;
evidence.workflow.userApproval = approvalPreserved ? 'approved' : 'pending';
evidence.workflow.rollout = 'awaiting-owner-review';
evidence.riskReview.humanAestheticReview = approvalPreserved
  ? evidence.riskReview.humanAestheticReview
  : { status: 'pending', evidence: 'Awaiting user review of the current Brand provenance.' };
if (!checkOnly) evidence.media.outputs = (evidence.media.outputs || []).filter(output => actualChangedFiles.has(output.repoPath));
for (const evidenceOutput of evidence.media.outputs) {
  const publishedOutput = manifest.outputs.find(output => output.logicalAssetId === evidenceOutput.logicalAssetId);
  if (!publishedOutput) throw new Error(`Evidence output is missing from Brand manifest: ${evidenceOutput.logicalAssetId}`);
  if (!checkOnly) evidenceOutput.changeKind = changeKinds.get(evidenceOutput.repoPath);
  evidenceOutput.path = publishedOutput.path;
  evidenceOutput.sha256 = publishedOutput.sha256;
  evidenceOutput.type = publishedOutput.mediaType;
  evidenceOutput.format = path.extname(publishedOutput.path).slice(1).toLowerCase() || evidenceOutput.format;
  evidenceOutput.width = publishedOutput.width;
  evidenceOutput.height = publishedOutput.height;
  evidenceOutput.metadataImagePath = publishedOutput.path;
}
const mediaMetadataPattern = /(?:property|name)\s*=\s*["'](?:og:image(?::(?:url|secure_url|type|width|height|alt))?|twitter:image(?::alt)?)\b|rel\s*=\s*["'][^"']*\b(?:icon|apple-touch-icon|manifest)\b/i;
if (!checkOnly) {
  evidence.media.metadataChangedFiles = evidence.applicationBoundary.changedFiles.filter(file => {
    if (/\.(?:png|jpe?g|webp|avif|svg|ico|webmanifest)$/i.test(file)) return false;
    const diff = execFileSync('git', ['diff', '--unified=0', 'HEAD', '--', file], { cwd: consumerRoot, encoding: 'utf8' });
    return diff.split(/\r?\n/).some(line => /^[+-](?![+-])/.test(line) && mediaMetadataPattern.test(line));
  });
  evidence.media.changed = evidence.media.outputs.length > 0 || evidence.media.metadataChangedFiles.length > 0;
}
evidence.roles.uiPrimary.foregroundRole = 'ink';
evidence.roles.uiPrimary.foregroundEvidence = 'Both theme scopes publish typed webAction.primary.foreground (Ink) from the hash-verified Brand working-tree export; no legacy white exception applies';
evidence.roles.uiPrimary.contrast = {
  status:'verified', normalTextRatio:Number(primaryContrast.toFixed(2)),
  evidence:'Resolved typed Brand web action normal/hover pairs meet WCAG AA; ratios ' + primaryContrast.toFixed(2) + ' / ' + hoverContrast.toFixed(2) + ':1. No legacy white exception applies.'
};
evidence.exceptions = (evidence.exceptions || []).filter(exception => exception.rule !== 'ui-primary-contrast');
evidence.exceptions = evidence.exceptions.filter(exception => !(exception.rule === 'decorative-gradient' && exception.file === 'scripts/sync-brand-consumer.mjs'));
evidence.exceptions.push({
  rule: 'decorative-gradient',
  file: 'scripts/sync-brand-consumer.mjs',
  approvedBy: 'user',
  reason: 'The user explicitly required preserving the pre-existing top/bottom page atmosphere; this generator only recolors those existing gradient tokens from the central Brand master and may not add a new treatment.'
});
let expectedEvidence = `${JSON.stringify(evidence, null, 2)}\n`;
if (!checkOnly && expectedEvidence !== evidenceSource && !evidence.applicationBoundary.changedFiles.includes('docs/BRAND-COMPATIBILITY.evidence.json')) {
  evidence.applicationBoundary.changedFiles.push('docs/BRAND-COMPATIBILITY.evidence.json');
  evidence.applicationBoundary.changedFiles.sort();
  expectedEvidence = `${JSON.stringify(evidence, null, 2)}\n`;
}
if (expectedEvidence !== evidenceSource) {
  changes.push('docs/BRAND-COMPATIBILITY.evidence.json');
  if (!checkOnly) await writeFile(evidencePath, expectedEvidence);
}

const htmlFiles = ['index.html', 'docs/changelog.html', 'docs/code-features.html', 'docs/configuration.html', 'docs/document-components.html', 'docs/getting-started.html', 'docs/navigation.html', 'docs/reference.html'];
for (const relativePath of htmlFiles) {
  const html = await readFile(path.join(consumerRoot, relativePath), 'utf8');
  if (/--(?:brand|identity-accent|ui-primary|page-(?:start|end)-gradient)\s*:/.test(html)) throw new Error(`Page-level Brand token override is forbidden: ${relativePath}`);
}

if (checkOnly && changes.length) throw new Error(`Brand consumer is stale: ${changes.join(', ')}`);
console.log(checkOnly ? 'Brand consumer is current.' : `Brand consumer synchronized (${changes.length} file${changes.length === 1 ? '' : 's'} changed).`);
