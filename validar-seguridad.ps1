$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$required = @("index.html","styles.css","app.js","release-config.js","release-assets.js","security.css","security-client.js","robots.txt",".nojekyll","404.html","SECURITY.md","DEPLOYMENT.md","release-assets-manifest.json","release-check.html")
$missing = @()
foreach ($item in $required) { if (-not (Test-Path -LiteralPath (Join-Path $root $item) -PathType Leaf)) { $missing += $item } }
if ($missing.Count -gt 0) { Write-Host "Faltan archivos de publicación:" -ForegroundColor Red; $missing | ForEach-Object { Write-Host " - $_" }; exit 1 }
$forbidden = @("access-config.js","login.html","login.css","login.js")
$found = $forbidden | Where-Object { Test-Path -LiteralPath (Join-Path $root $_) }
if ($found) { Write-Host "Todavía existen archivos de autenticación:" -ForegroundColor Red; $found | ForEach-Object { Write-Host " - $_" }; exit 1 }
$index = [System.IO.File]::ReadAllText((Join-Path $root "index.html"), [System.Text.Encoding]::UTF8)
if ($index -match "login\.html|access-config\.js|access-locked|IPATH_ACCESS") { Write-Host "index.html todavía contiene referencias de autenticación." -ForegroundColor Red; exit 1 }
Write-Host "Validación de publicación pública GitHub Pages + Release correcta." -ForegroundColor Green
