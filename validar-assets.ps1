$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifestPath = Join-Path $root "release-assets-manifest.json"
$configPath = Join-Path $root "release-config.js"

if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
  Write-Host "Falta release-assets-manifest.json" -ForegroundColor Red
  exit 1
}
if (-not (Test-Path -LiteralPath $configPath -PathType Leaf)) {
  Write-Host "Falta release-config.js" -ForegroundColor Red
  exit 1
}

$json = [System.IO.File]::ReadAllText($manifestPath, [System.Text.Encoding]::UTF8)
$manifest = $json | ConvertFrom-Json
$duplicates = $manifest.assets | Group-Object | Where-Object { $_.Count -gt 1 }
if ($duplicates) {
  Write-Host "Hay nombres duplicados en el manifiesto del Release:" -ForegroundColor Red
  $duplicates | ForEach-Object { Write-Host " - $($_.Name)" }
  exit 1
}

if ($manifest.tag -ne "catalogoipath") {
  Write-Host "El tag del manifiesto no es catalogoipath." -ForegroundColor Red
  exit 1
}

Write-Host "OK: configuración local del Release válida." -ForegroundColor Green
Write-Host "Release esperado: $($manifest.release_name)" -ForegroundColor Cyan
Write-Host "Tag esperado: $($manifest.tag)" -ForegroundColor Cyan
Write-Host "Archivos esperados: $($manifest.assets.Count)" -ForegroundColor Cyan
Write-Host "Nota: la existencia online se comprueba después de publicar el repositorio." -ForegroundColor Yellow
