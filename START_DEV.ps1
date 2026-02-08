# START_DEV.ps1 - Start the Next.js dev server
# This script ensures the server starts from the correct lowercase path
# to avoid Windows path casing issues that cause React hydration failures.

# Stop any existing node processes
Write-Host "Stopping any existing Node.js processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Clear the .next cache to ensure clean build
Write-Host "Clearing .next cache..." -ForegroundColor Yellow
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$nextDir = Join-Path $scriptDir ".next"
if (Test-Path $nextDir) {
    Remove-Item -Recurse -Force $nextDir -ErrorAction SilentlyContinue
    Write-Host "Cleared .next directory" -ForegroundColor Green
}

# Get the real filesystem path (with correct casing)
# This is critical on Windows where VS Code may open with different casing
$realPath = (Get-Item $scriptDir).FullName
Write-Host "Starting server from: $realPath" -ForegroundColor Cyan

# Change to the real path
Set-Location $realPath

# Set environment and start the dev server
Write-Host "Starting Next.js dev server on port 3333..." -ForegroundColor Green
$env:NODE_OPTIONS = "--max-old-space-size=4096"

# Use Start-Process to keep the server running as a detached process
# This prevents VS Code terminal from killing it when running other commands
Start-Process -FilePath "C:\Program Files\nodejs\npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory $realPath -NoNewWindow

Write-Host ""
Write-Host "Server starting in background..." -ForegroundColor Cyan
Write-Host "Wait 10-15 seconds for compilation, then visit:" -ForegroundColor White
Write-Host "  http://localhost:3333" -ForegroundColor Green
Write-Host ""
Write-Host "To stop the server, run:" -ForegroundColor Yellow
Write-Host '  Get-Process node | Stop-Process -Force' -ForegroundColor Yellow
