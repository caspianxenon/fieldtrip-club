#!/usr/bin/env powershell
# Field Trip Club - Startup Instructions for Windows

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Field Trip Club - Complete Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "📍 YOU ARE HERE: " -ForegroundColor Cyan
Write-Host "c:\Users\LENOVO\OneDrive\Documents\fieldtrip-club\" -ForegroundColor Yellow
Write-Host ""

Write-Host "🚀 QUICK START (5 MINUTES)" -ForegroundColor Cyan
Write-Host "========================================"
Write-Host ""

Write-Host "STEP 1: Create .env file" -ForegroundColor Yellow
Write-Host "  → Copy .env.example to .env" -ForegroundColor White
Write-Host "  → Edit .env and add your Gmail credentials" -ForegroundColor White
Write-Host "  Command: Copy-Item .env.example .env" -ForegroundColor Gray
Write-Host ""

Write-Host "STEP 2: Install dependencies" -ForegroundColor Yellow
Write-Host "  → Run: npm install" -ForegroundColor White
Write-Host "  → Wait for all packages to download (~1 minute)" -ForegroundColor White
Write-Host ""

Write-Host "STEP 3: Start Backend Server (Terminal 1)" -ForegroundColor Yellow
Write-Host "  → Run: npm start" -ForegroundColor White
Write-Host "  → You should see:" -ForegroundColor White
Write-Host "     ✓ Field Trip Club Backend running on http://localhost:5000" -ForegroundColor Green
Write-Host "  → Keep this terminal open!" -ForegroundColor Red
Write-Host ""

Write-Host "STEP 4: Start Frontend Server (Terminal 2)" -ForegroundColor Yellow
Write-Host "  → Open new PowerShell window in same directory" -ForegroundColor White
Write-Host "  → Run: python -m http.server 3000" -ForegroundColor White
Write-Host "  → You should see:" -ForegroundColor White
Write-Host "     Serving HTTP on 0.0.0.0 port 3000" -ForegroundColor Green
Write-Host "  → Keep this terminal open!" -ForegroundColor Red
Write-Host ""

Write-Host "STEP 5: Open in Browser" -ForegroundColor Yellow
Write-Host "  → Go to: http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "📚 DOCUMENTATION FILES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Read in this order:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. QUICKSTART.md" -ForegroundColor White
Write-Host "   → 5-minute setup guide" -ForegroundColor Gray
Write-Host "   → Common issues & fixes" -ForegroundColor Gray
Write-Host ""
Write-Host "2. README.md" -ForegroundColor White
Write-Host "   → Complete documentation" -ForegroundColor Gray
Write-Host "   → API reference" -ForegroundColor Gray
Write-Host "   → Configuration guide" -ForegroundColor Gray
Write-Host ""
Write-Host "3. TESTING_CHECKLIST.md" -ForegroundColor White
Write-Host "   → Verify everything works" -ForegroundColor Gray
Write-Host "   → 150+ test cases" -ForegroundColor Gray
Write-Host ""
Write-Host "4. BACKEND_SETUP.md" -ForegroundColor White
Write-Host "   → Server configuration" -ForegroundColor Gray
Write-Host "   → Database setup (Firebase/MongoDB)" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 Navigation: FILE_GUIDE.md" -ForegroundColor Cyan
Write-Host "   → Overview of all 19 files" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ WHAT'S INCLUDED" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend (8 files):" -ForegroundColor Yellow
Write-Host "  ✓ index.html - Homepage" -ForegroundColor White
Write-Host "  ✓ register.html - Sign up (Excursor + Event Holder)" -ForegroundColor White
Write-Host "  ✓ login.html - Sign in with OTP" -ForegroundColor White
Write-Host "  ✓ trips.html - Browse trips" -ForegroundColor White
Write-Host "  ✓ dashboard.html - User dashboard" -ForegroundColor White
Write-Host "  ✓ contact.html - Contact form" -ForegroundColor White
Write-Host "  ✓ style.css - Complete styling" -ForegroundColor White
Write-Host "  ✓ script.js - All JavaScript (500+ lines)" -ForegroundColor White
Write-Host ""

Write-Host "Backend (2 files):" -ForegroundColor Yellow
Write-Host "  ✓ server.js - API server with 10+ endpoints" -ForegroundColor White
Write-Host "  ✓ package.json - Node dependencies" -ForegroundColor White
Write-Host ""

Write-Host "Configuration (2 files):" -ForegroundColor Yellow
Write-Host "  ✓ .env.example - Configuration template" -ForegroundColor White
Write-Host "  ✓ .env - YOU CREATE THIS (not included)" -ForegroundColor White
Write-Host ""

Write-Host "Documentation (6 files):" -ForegroundColor Yellow
Write-Host "  ✓ QUICKSTART.md - 5-minute setup" -ForegroundColor White
Write-Host "  ✓ README.md - Complete guide (30 KB)" -ForegroundColor White
Write-Host "  ✓ BACKEND_SETUP.md - Server configuration" -ForegroundColor White
Write-Host "  ✓ TESTING_CHECKLIST.md - QA procedures" -ForegroundColor White
Write-Host "  ✓ DELIVERY_SUMMARY.md - Overview" -ForegroundColor White
Write-Host "  ✓ FILE_GUIDE.md - File navigation" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "🧪 TEST THE SETUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "After opening http://localhost:3000, try:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Register as Excursor" -ForegroundColor White
Write-Host "   - Click 'Register'" -ForegroundColor Gray
Write-Host "   - Choose 'Excursor'" -ForegroundColor Gray
Write-Host "   - Fill form and submit" -ForegroundColor Gray
Write-Host "   - Check terminal for OTP (6 digits)" -ForegroundColor Gray
Write-Host "   - Enter OTP and verify" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Go to Trips page" -ForegroundColor White
Write-Host "   - Click 'Trips' in navbar" -ForegroundColor Gray
Write-Host "   - Click 'Join Trip' on any trip" -ForegroundColor Gray
Write-Host "   - See confirmation" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Register as Event Holder (complete flow)" -ForegroundColor White
Write-Host "   - Click 'Register'" -ForegroundColor Gray
Write-Host "   - Choose 'Event Holder'" -ForegroundColor Gray
Write-Host "   - Complete: Email → OTP → KYC → Payment" -ForegroundColor Gray
Write-Host "   - Simulate payment success when prompted" -ForegroundColor Gray
Write-Host "   - Access dashboard and create trip" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "🔧 COMMON ISSUES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Problem: ""Module not found: express""" -ForegroundColor Red
Write-Host "  Solution: Run 'npm install'" -ForegroundColor Green
Write-Host ""

Write-Host "Problem: ""Port 5000 already in use""" -ForegroundColor Red
Write-Host "  Solution: netstat -ano | findstr :5000" -ForegroundColor Green
Write-Host "           taskkill /PID <PID> /F" -ForegroundColor Green
Write-Host ""

Write-Host "Problem: ""OTP not appearing""" -ForegroundColor Red
Write-Host "  Solution: Check backend terminal for OTP code" -ForegroundColor Green
Write-Host ""

Write-Host "Problem: ""API connection error""" -ForegroundColor Red
Write-Host "  Solution: Ensure both servers running (ports 5000 & 3000)" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "💡 NEXT STEPS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "After verifying everything works:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Customize (Day 1)" -ForegroundColor White
Write-Host "   - Update colors in style.css" -ForegroundColor Gray
Write-Host "   - Change company name/logo" -ForegroundColor Gray
Write-Host "   - Update trip data in server.js" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Integrate Real APIs (Week 1)" -ForegroundColor White
Write-Host "   - Get KYC provider API key" -ForegroundColor Gray
Write-Host "   - Get MPesa Till credentials" -ForegroundColor Gray
Write-Host "   - Replace placeholder functions" -ForegroundColor Gray
Write-Host "   - See README.md for instructions" -ForegroundColor Gray
Write-Host ""

Write-Host "3. Deploy to Production (Month 1)" -ForegroundColor White
Write-Host "   - Set up Firebase or MongoDB" -ForegroundColor Gray
Write-Host "   - Deploy backend to Heroku/Railway" -ForegroundColor Gray
Write-Host "   - Deploy frontend to Vercel/Netlify" -ForegroundColor Gray
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "📊 PROJECT STATS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Total Files: 19" -ForegroundColor White
Write-Host "Total Code: 4,700+ lines" -ForegroundColor White
Write-Host "Documentation: 100+ pages" -ForegroundColor White
Write-Host "Setup Time: 5 minutes" -ForegroundColor White
Write-Host "Testing Scenarios: 150+" -ForegroundColor White
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "✨ YOU'RE ALL SET!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Read QUICKSTART.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Questions? Check the comprehensive README.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ready to code? Follow QUICKSTART.md - it takes only 5 minutes!" -ForegroundColor Green
Write-Host ""

# Offer to open QUICKSTART
$open = Read-Host "Open QUICKSTART.md now? (y/n)"
if ($open -eq "y" -or $open -eq "Y") {
    & "notepad" "QUICKSTART.md"
}
