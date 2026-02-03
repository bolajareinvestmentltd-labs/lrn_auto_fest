#!/usr/bin/env powershell
# 🚀 IAF 2026 PROJECT LAUNCHER
# Quick setup script for local development

Write-Host "🚀 ILORIN AUTOMOTIVE FESTIVAL 2026 - LOCAL SETUP" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

$projectPath = (Get-Location).Path
Write-Host "📁 Project: $projectPath"
Write-Host ""

# Check Node.js
Write-Host "✓ Checking Node.js..." -ForegroundColor Cyan
$nodeVersion = node --version
Write-Host "  Node: $nodeVersion"
Write-Host ""

# Check npm
Write-Host "✓ Checking npm..." -ForegroundColor Cyan
$npmVersion = npm --version
Write-Host "  npm: $npmVersion"
Write-Host ""

# Check dependencies
Write-Host "✓ Checking dependencies..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Write-Host "  ✅ Dependencies installed"
} else {
    Write-Host "  ❌ Dependencies not found. Run: npm install" -ForegroundColor Red
}
Write-Host ""

# Check environment
Write-Host "✓ Environment Configuration:" -ForegroundColor Cyan
if (Test-Path ".env.local") {
    Write-Host "  ✅ .env.local exists"
} else {
    Write-Host "  ⚠️  .env.local not found. Copy from .env.example:" -ForegroundColor Yellow
    Write-Host "     cp .env.example .env.local" -ForegroundColor Yellow
}
Write-Host ""

# Show next steps
Write-Host "📋 NEXT STEPS:" -ForegroundColor Green
Write-Host ""
Write-Host "1️⃣  Setup Supabase Database:" -ForegroundColor Cyan
Write-Host "    • Go to https://supabase.com"
Write-Host "    • Create a new PostgreSQL project"
Write-Host "    • Copy DATABASE_URL, ANON_KEY, SERVICE_ROLE_KEY"
Write-Host "    • Paste into .env.local"
Write-Host ""
Write-Host "2️⃣  Initialize Database:" -ForegroundColor Cyan
Write-Host "    npm run prisma:migrate"
Write-Host ""
Write-Host "3️⃣  Start Development Server:" -ForegroundColor Cyan
Write-Host "    npm run dev"
Write-Host ""
Write-Host "4️⃣  Open in Browser:" -ForegroundColor Cyan
Write-Host "    http://localhost:3000"
Write-Host ""

Write-Host "🎨 Design System:" -ForegroundColor Green
Write-Host "  • Colors: Dark theme (Black, Electric Blue, Orange)"
Write-Host "  • Fonts: Inter + Orbitron"
Write-Host "  • Tailwind CSS 4.0 configured"
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Green
Write-Host "  • PROJECT_SETUP.md - Complete setup guide"
Write-Host "  • QUICK_START.md - Fast onboarding"
Write-Host "  • ARCHITECTURE.md - System design"
Write-Host "  • FOUNDATION_COMPLETE.md - Summary"
Write-Host ""

Write-Host "🛠️  Available Commands:" -ForegroundColor Green
Write-Host "  npm run dev              - Start dev server"
Write-Host "  npm run build            - Build for production"
Write-Host "  npm run start            - Run production build"
Write-Host "  npm run lint             - Check code quality"
Write-Host "  npm run type-check       - TypeScript check"
Write-Host "  npm run prisma:studio    - Open database GUI"
Write-Host ""

Write-Host "✅ SETUP COMPLETE - Ready for development!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
