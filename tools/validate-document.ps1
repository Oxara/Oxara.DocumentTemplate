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

foreach ($requiredFile in @("README.md", "LICENSE", "og-image.svg", "sitemap.xml")) {
    if (-not (Test-Path -LiteralPath (Join-Path $root $requiredFile) -PathType Leaf)) {
        Add-ValidationError "Eksik kok dosya: $requiredFile"
    }
}

$licensePath = Join-Path $root "LICENSE"
if (Test-Path -LiteralPath $licensePath -PathType Leaf) {
    $license = Get-Content -LiteralPath $licensePath -Raw -Encoding UTF8
    if ($license -notmatch '^MIT License' -or $license -notmatch 'Copyright \(c\) \d{4} Oxara') {
        Add-ValidationError "LICENSE standart Oxara MIT lisans metni degil."
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

    foreach ($readmeSection in @(
        '(?m)^## Bu rehber neyi .+',
        '(?m)^## Kimler i.+',
        '(?m)^## .+erik haritas.+',
        '(?m)^## Rehberin yakla.+m.+',
        '(?m)^## .+ne .+kan production ilkeleri',
        '(?m)^## Teknik yap.+',
        '(?m)^## Katk.+',
        '(?m)^## Lisans'
    )) {
        if ($readme -notmatch $readmeSection) {
            Add-ValidationError "README.md standart bolumu eksik: $readmeSection"
        }
    }
}

$ogImagePath = Join-Path $root "og-image.svg"
if (Test-Path -LiteralPath $ogImagePath -PathType Leaf) {
    $ogImage = Get-Content -LiteralPath $ogImagePath -Raw -Encoding UTF8
    if ($ogImage -notmatch 'width="1200"' -or $ogImage -notmatch 'height="630"') {
        Add-ValidationError "og-image.svg olcusu 1200 x 630 olmalidir."
    }
    if ($ogImage -notmatch 'role="img"' -or $ogImage -notmatch '<title\b' -or $ogImage -notmatch '<desc\b') {
        Add-ValidationError "og-image.svg erisilebilir role, title ve desc alanlarini icermelidir."
    }
    if ($ogImage -notmatch '<rect x="40" y="40" width="1120" height="550" rx="20"') {
        Add-ValidationError "og-image.svg ortak sosyal gorsel panel yerlesimini kullanmiyor."
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

    if ($html -match '&amp;(?:lt|gt|quot|amp);') {
        Add-ValidationError "$relativePath cift kacirilmis HTML entity iceriyor."
    }

    foreach ($pattern in @(
        'rel="canonical"',
        'property="og:url"',
        'property="og:image"',
        'property="og:image:type" content="image/svg\+xml"',
        'property="og:image:width" content="1200"',
        'property="og:image:height" content="630"',
        'property="og:image:alt"',
        'name="twitter:card" content="summary_large_image"',
        'name="twitter:image"',
        'name="twitter:image:alt"'
    )) {
        if ($html -notmatch $pattern) {
            Add-ValidationError "$relativePath metadata eksik: $pattern"
        }
    }

    foreach ($uniquePattern in @(
        '<meta property="og:image" ',
        '<meta name="twitter:image" '
    )) {
        if ([regex]::Matches($html, [regex]::Escape($uniquePattern)).Count -ne 1) {
            Add-ValidationError "$relativePath metadata tekil degil: $uniquePattern"
        }
    }

    $ogImageMatch = [regex]::Match($html, '<meta property="og:image" content="([^"]+)"')
    $twitterImageMatch = [regex]::Match($html, '<meta name="twitter:image" content="([^"]+)"')
    if ($ogImageMatch.Success -and $twitterImageMatch.Success -and
        $ogImageMatch.Groups[1].Value -ne $twitterImageMatch.Groups[1].Value) {
        Add-ValidationError "$relativePath og:image ve twitter:image ayni URL'yi kullanmiyor."
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
