param(
    [Parameter(Mandatory = $true)]
    [string]$TargetRoot,

    [string[]]$Features = @(
        "theme",
        "code-highlight",
        "copy-code",
        "code-tabs",
        "sidemenu",
        "search",
        "scroll-top",
        "reading-progress"
    )
)

$ErrorActionPreference = "Stop"

$templateRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $templateRoot "features"
$resolvedTarget = [System.IO.Path]::GetFullPath($TargetRoot)

if (-not (Test-Path -LiteralPath $resolvedTarget -PathType Container)) {
    throw "Hedef proje klasoru bulunamadi: $resolvedTarget"
}

$available = Get-ChildItem -LiteralPath $sourceRoot -Directory |
    Select-Object -ExpandProperty Name

$selected = [System.Collections.Generic.List[string]]::new()
$selected.Add("base")

foreach ($feature in $Features) {
    if ($feature -notin $available) {
        throw "Bilinmeyen feature: $feature. Kullanilabilir: $($available -join ', ')"
    }
    if (-not $selected.Contains($feature)) {
        $selected.Add($feature)
    }
}

if ($selected.Contains("copy-code") -and -not $selected.Contains("code-highlight")) {
    $selected.Add("code-highlight")
}

$targetFeatures = Join-Path $resolvedTarget "features"
New-Item -ItemType Directory -Path $targetFeatures -Force | Out-Null

foreach ($feature in $selected) {
    $source = Join-Path $sourceRoot $feature
    $destination = Join-Path $targetFeatures $feature
    New-Item -ItemType Directory -Path $destination -Force | Out-Null
    Get-ChildItem -LiteralPath $source -Force | ForEach-Object {
        Copy-Item -LiteralPath $_.FullName -Destination $destination -Recurse -Force
    }
}

Copy-Item -LiteralPath (Join-Path $sourceRoot "features.json") -Destination $targetFeatures -Force

Write-Host "Senkronlanan hedef: $targetFeatures"
Write-Host "Feature'lar: $($selected -join ', ')"
