param(
    [Parameter(Mandatory = $true)]
    [string]$HandbooksRoot
)

$ErrorActionPreference = "Stop"

$root = [System.IO.Path]::GetFullPath($HandbooksRoot)
$validator = Join-Path $PSScriptRoot "validate-document.ps1"
$failed = [System.Collections.Generic.List[string]]::new()

$handbooks = Get-ChildItem -LiteralPath $root -Directory |
    Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName "index.html") -PathType Leaf } |
    Sort-Object Name

foreach ($handbook in $handbooks) {
    Write-Host ""
    Write-Host "[$($handbook.Name)]"
    try {
        & $validator -DocumentRoot $handbook.FullName
    } catch {
        Write-Error $_
        $failed.Add($handbook.Name)
    }
}

if ($failed.Count -gt 0) {
    Write-Error "Dogrulama basarisiz: $($failed -join ', ')"
    exit 1
}

Write-Host ""
Write-Host "Tum handbook'lar standarda uygun: $($handbooks.Count)"
