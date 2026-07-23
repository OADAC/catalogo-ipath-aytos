$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$manifest = Get-Content (Join-Path $root "asset-manifest.json") -Raw | ConvertFrom-Json
$missing = @()
foreach ($rel in $manifest.primary_assets) {
  $full = Join-Path $root $rel
  if (-not (Test-Path -LiteralPath $full)) { $missing += $rel }
}
if ($missing.Count -eq 0) {
  Write-Host "OK: todos los assets definitivos están disponibles." -ForegroundColor Green
  exit 0
}
Write-Host "Faltan $($missing.Count) assets:" -ForegroundColor Yellow
$missing | ForEach-Object { Write-Host " - $_" }
exit 1
