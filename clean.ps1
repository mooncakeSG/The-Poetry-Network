if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

# Clean Next.js build files
Write-Host "Cleaning Next.js build files..." -ForegroundColor Yellow
if (Test-Path .next) {
    Remove-Item -Recurse -Force .next
}

# Clean node_modules
Write-Host "Cleaning node_modules..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Remove-Item -Recurse -Force node_modules
}

# Clean TypeScript cache
Write-Host "Cleaning TypeScript cache..." -ForegroundColor Yellow
if (Test-Path *.tsbuildinfo) {
    Remove-Item *.tsbuildinfo
}

# Clean test coverage
Write-Host "Cleaning test coverage..." -ForegroundColor Yellow
if (Test-Path coverage) {
    Remove-Item -Recurse -Force coverage
}

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Reinstall dependencies
Write-Host "Reinstalling dependencies..." -ForegroundColor Green
npm install

Write-Host "Clean complete! 🧹" -ForegroundColor Green 