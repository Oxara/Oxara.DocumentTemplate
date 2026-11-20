# Static web release checks

This is the maintained DocumentTemplate release checker, compatible with AIO's
source/evidence workflow. It is not the retired Oxara.DevKit and does not claim
to have run that unavailable code. It uses Node and the locked `parse5` parser.

```powershell
npm ci --ignore-scripts
npm test
node tools/release-checks/cli.mjs audit --config <consumer-config.json>
node tools/release-checks/cli.mjs quality --config <consumer-config.json>
node tools/release-checks/cli.mjs finalize --config <consumer-config.json>
```

The config defines `projectRoot` relative to its own location, then `artifact`,
`reports`, canonical `origin`, required files/routes, protected file hashes,
explicit source-check commands and fresh browser evidence. No shell command
strings, deployment credentials, network submission or Git mutation are needed.
Command environments are explicit dependency paths relative to the consumer.

## Gates

- `audit`: inventory/hash every artifact file; reject private paths/symlinks;
  parse all HTML; verify canonical/OG/JSON-LD, local assets and links, CSS assets,
  JS syntax, sitemap/robots and explicit redirect destinations/chains.
- `quality`: require the unchanged audited artifact and configuration; run the
  actual configured commands, reject any nonzero exit or artifact mutation,
  preserve protected documents and require fresh browser case/screenshot evidence
  bound to that artifact digest. Browser evidence comes from actual observation,
  never from a script that labels untested cases successful.
- `finalize`: require both passed reports and matching file/config/report hashes.
  Produce only `ready-for-owner-approval`, always `published:false` and
  `requiresOwnerApproval:true`. Changing one public byte invalidates the gate.

Ten regression tests cover valid flow and rejection of broken links, redirect
cycles, sitemap/noindex mistakes, invalid JSON-LD, blocked robots, missing CSS
assets, private paths, changed artifacts/config/reports, failed commands,
protected content drift and incomplete/stale browser evidence.

This is not a claim of exhaustive accessibility, SEO ranking, security or live
hosting verification. Record accepted exceptions and unverified external state.
Visual review, owner approval, commit and deployment are separate operations.

## Hosting URL policy

Default routing uses file URLs. Set `routingMode: "cloudflare-pages"` only for
Cloudflare Pages consumers: canonical/OG/sitemap use the final extensionless
address, while the auditor resolves it to the existing `.html` source file.
The shared path policy lives in `scripts/public-route-addresses.mjs`. GitHub
Pages consumers retain file URLs. This does not rename source documents.
