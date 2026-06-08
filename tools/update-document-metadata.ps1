param(
    [Parameter(Mandatory = $true)]
    [string]$DocumentRoot,

    [Parameter(Mandatory = $true)]
    [string]$SiteUrl,

    [Parameter(Mandatory = $true)]
    [string]$SiteName,

    [string]$ImageName = "og-image.svg",

    [string]$LastModified = (Get-Date -Format "yyyy-MM-dd")
)

$ErrorActionPreference = "Stop"

$root = [System.IO.Path]::GetFullPath($DocumentRoot)
$baseUrl = $SiteUrl.TrimEnd("/") + "/"
$imageUrl = $baseUrl + $ImageName
$utf8WithoutBom = [System.Text.UTF8Encoding]::new($false)

$managedPatterns = @(
    '(?m)^\s*<meta\s+name="robots"[^>]*>\s*\r?\n?',
    '(?m)^\s*<link\s+rel="canonical"[^>]*>\s*\r?\n?',
    '(?m)^\s*<meta\s+property="og:(type|title|description|url|site_name|locale|image)"[^>]*>\s*\r?\n?',
    '(?m)^\s*<meta\s+name="twitter:(card|title|description|image)"[^>]*>\s*\r?\n?'
)

$htmlFiles = Get-ChildItem -LiteralPath $root -Recurse -Filter "*.html" -File |
    Where-Object { $_.FullName -notmatch '[\\/]\.git[\\/]' } |
    Sort-Object FullName

$sitemapEntries = [System.Collections.Generic.List[string]]::new()

foreach ($htmlFile in $htmlFiles) {
    $relativePath = $htmlFile.FullName.Substring($root.Length).TrimStart("\", "/").Replace("\", "/")
    $pageUrl = if ($relativePath -eq "index.html") {
        $baseUrl
    } else {
        $baseUrl + $relativePath
    }

    $html = Get-Content -LiteralPath $htmlFile.FullName -Raw -Encoding UTF8
    $titleMatch = [regex]::Match($html, '<title>(.*?)</title>', "Singleline")
    $descriptionMatch = [regex]::Match(
        $html,
        '<meta\s+name="description"\s+content="([^"]*)">',
        "Singleline"
    )

    if (-not $titleMatch.Success -or -not $descriptionMatch.Success) {
        throw "Title veya description bulunamadi: $relativePath"
    }

    foreach ($pattern in $managedPatterns) {
        $html = [regex]::Replace($html, $pattern, "")
    }

    $title = $titleMatch.Groups[1].Value
    $description = $descriptionMatch.Groups[1].Value
    $pageType = if ($relativePath -eq "index.html") { "website" } else { "article" }
    $metadata = @"
<meta name="robots" content="index, follow">
<link rel="canonical" href="$pageUrl">
<meta property="og:type" content="$pageType">
<meta property="og:title" content="$title">
<meta property="og:description" content="$description">
<meta property="og:url" content="$pageUrl">
<meta property="og:site_name" content="$SiteName">
<meta property="og:locale" content="tr_TR">
<meta property="og:image" content="$imageUrl">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="$title">
<meta name="twitter:description" content="$description">
<meta name="twitter:image" content="$imageUrl">
"@

    $descriptionTag = $descriptionMatch.Value
    $html = $html.Replace($descriptionTag, "$descriptionTag`r`n$metadata")
    [System.IO.File]::WriteAllText($htmlFile.FullName, $html, $utf8WithoutBom)

    $priority = if ($relativePath -eq "index.html") { "1.0" } else { "0.8" }
    $sitemapEntries.Add(@"
  <url>
    <loc>$pageUrl</loc>
    <lastmod>$LastModified</lastmod>
    <changefreq>monthly</changefreq>
    <priority>$priority</priority>
  </url>
"@)
}

$sitemap = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$($sitemapEntries -join "`r`n")
</urlset>
"@

[System.IO.File]::WriteAllText((Join-Path $root "sitemap.xml"), $sitemap, $utf8WithoutBom)

Write-Host "Metadata ve sitemap guncellendi: $root"
Write-Host "HTML sayfasi: $($htmlFiles.Count)"
