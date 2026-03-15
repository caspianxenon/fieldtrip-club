@echo off
REM Field Trip Club - Project Verification Script (Windows)
REM Verifies all required files are present

echo.
echo ====================================
echo Field Trip Club - File Verification
echo ====================================
echo.

setlocal enabledelayedexpansion
set verified=0
set missing=0

echo Frontend Files:
if exist "index.html" (
    echo [OK] index.html
    set /a verified+=1
) else (
    echo [MISSING] index.html
    set /a missing+=1
)

if exist "register.html" (
    echo [OK] register.html
    set /a verified+=1
) else (
    echo [MISSING] register.html
    set /a missing+=1
)

if exist "login.html" (
    echo [OK] login.html
    set /a verified+=1
) else (
    echo [MISSING] login.html
    set /a missing+=1
)

if exist "trips.html" (
    echo [OK] trips.html
    set /a verified+=1
) else (
    echo [MISSING] trips.html
    set /a missing+=1
)

if exist "dashboard.html" (
    echo [OK] dashboard.html
    set /a verified+=1
) else (
    echo [MISSING] dashboard.html
    set /a missing+=1
)

if exist "contact.html" (
    echo [OK] contact.html
    set /a verified+=1
) else (
    echo [MISSING] contact.html
    set /a missing+=1
)

if exist "style.css" (
    echo [OK] style.css
    set /a verified+=1
) else (
    echo [MISSING] style.css
    set /a missing+=1
)

if exist "script.js" (
    echo [OK] script.js
    set /a verified+=1
) else (
    echo [MISSING] script.js
    set /a missing+=1
)

echo.
echo Backend Files:
if exist "server.js" (
    echo [OK] server.js
    set /a verified+=1
) else (
    echo [MISSING] server.js
    set /a missing+=1
)

if exist "package.json" (
    echo [OK] package.json
    set /a verified+=1
) else (
    echo [MISSING] package.json
    set /a missing+=1
)

echo.
echo Configuration ^& Documentation:
if exist ".env.example" (
    echo [OK] .env.example
    set /a verified+=1
) else (
    echo [MISSING] .env.example
    set /a missing+=1
)

if exist "README.md" (
    echo [OK] README.md
    set /a verified+=1
) else (
    echo [MISSING] README.md
    set /a missing+=1
)

if exist "BACKEND_SETUP.md" (
    echo [OK] BACKEND_SETUP.md
    set /a verified+=1
) else (
    echo [MISSING] BACKEND_SETUP.md
    set /a missing+=1
)

if exist "QUICKSTART.md" (
    echo [OK] QUICKSTART.md
    set /a verified+=1
) else (
    echo [MISSING] QUICKSTART.md
    set /a missing+=1
)

echo.
echo ====================================
echo Files verified: %verified%
if %missing% gtr 0 (
    echo Files missing: %missing% - Please check above
) else (
    echo All files present - Ready to run!
)
echo ====================================
echo.
echo Next steps:
echo 1. Create .env file (copy from .env.example)
echo 2. Run: npm install
echo 3. Run: npm start (in terminal 1)
echo 4. Run: python -m http.server 3000 (in terminal 2)
echo 5. Open: http://localhost:3000
echo.
pause
