param(
    [Parameter(Mandatory = $true)]
    [string]$DocumentRoot
)

$ErrorActionPreference = "Stop"

$root = [System.IO.Path]::GetFullPath($DocumentRoot)
$errors = [System.Collections.Generic.List[string]]::new()

function Add-ValidationError {
    param([string]$Message)
    $errors.Add($Message)
}

foreach ($requiredFile in @("README.md", "og-image.svg", "sitemap.xml")) {
    if (-not (Test-Path -LiteralPath (Join-Path $root $requiredFile) -PathType Leaf)) {
        Add-ValidationError "Eksik kok dosya: $requiredFile"
    }
}

$readmeFiles = Get-ChildItem -LiteralPath $root -Recurse -Filter "README.md" -File
if ($readmeFiles.Count -ne 1) {
    Add-ValidationError "Dokuman reposunda kokte tek README.md bulunmalidir. Bulunan: $($readmeFiles.Count)"
}

$readmePath = Join-Path $root "README.md"
if (Test-Path -LiteralPath $readmePath -PathType Leaf) {
    $readme = Get-Content -LiteralPath $readmePath -Raw -Encoding UTF8
    if ($readme -notmatch '<img[^>]+src="og-image\.svg"') {
        Add-ValidationError "README.md, og-image.svg kapak gorselini gostermiyor."
    }
}

$ogImagePath = Join-Path $root "og-image.svg"
if (Test-Path -LiteralPath $ogImagePath -PathType Leaf) {
    $ogImage = Get-Content -LiteralPath $ogImagePath -Raw -Encoding UTF8
    if ($ogImage -notmatch 'width="1200"' -or $ogImage -notmatch 'height="630"') {
        Add-ValidationError "og-image.svg olcusu 1200 x 630 olmalidir."
    }
}

$sitemapPath = Join-Path $root "sitemap.xml"
$sitemap = if (Test-Path -LiteralPath $sitemapPath -PathType Leaf) {
    Get-Content -LiteralPath $sitemapPath -Raw -Encoding UTF8
} else {
    ""
}

$htmlFiles = Get-ChildItem -LiteralPath $root -Recurse -Filter "*.html" -File |
    Where-Object { $_.FullName -notmatch '[\\/]\.git[\\/]' }

foreach ($htmlFile in $htmlFiles) {
    $relativePath = $htmlFile.FullName.Substring($root.Length).TrimStart("\", "/")
    $html = Get-Content -LiteralPath $htmlFile.FullName -Raw -Encoding UTF8

    foreach ($pattern in @(
        'rel="canonical"',
        'property="og:url"',
        'property="og:image"',
        'name="twitter:image"'
    )) {
        if ($html -notmatch $pattern) {
            Add-ValidationError "$relativePath metadata eksik: $pattern"
        }
    }

    $canonicalMatch = [regex]::Match($html, '<link\s+rel="canonical"\s+href="([^"]+)"')
    if ($canonicalMatch.Success -and $sitemap -notmatch [regex]::Escape($canonicalMatch.Groups[1].Value)) {
        Add-ValidationError "$relativePath canonical adresi sitemap.xml icinde yok."
    }
}

if ($errors.Count -gt 0) {
    throw ($errors -join [Environment]::NewLine)
}

Write-Host "Dogrulama basarili: $root"
Write-Host "HTML sayfasi: $($htmlFiles.Count)"
