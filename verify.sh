#!/bin/bash
# Field Trip Club - Project Verification Script
# Verifies all required files are present

echo "🔍 Field Trip Club - File Verification"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Count verified files
VERIFIED=0
MISSING=0

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((VERIFIED++))
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        ((MISSING++))
    fi
}

# Frontend Files
echo "Frontend Files:"
check_file "index.html"
check_file "register.html"
check_file "login.html"
check_file "trips.html"
check_file "dashboard.html"
check_file "contact.html"
check_file "style.css"
check_file "script.js"

echo ""
echo "Backend Files:"
check_file "server.js"
check_file "package.json"

echo ""
echo "Configuration & Documentation:"
check_file ".env.example"
check_file "README.md"
check_file "BACKEND_SETUP.md"
check_file "QUICKSTART.md"

echo ""
echo "========================================"
echo -e "Files verified: ${GREEN}$VERIFIED${NC}"
if [ $MISSING -gt 0 ]; then
    echo -e "Files missing: ${RED}$MISSING${NC}"
else
    echo -e "All files present! ${GREEN}✓${NC}"
fi
echo ""
echo "Next steps:"
echo "1. Create .env file (copy from .env.example)"
echo "2. Run: npm install"
echo "3. Run: npm start (in terminal 1)"
echo "4. Run: python -m http.server 3000 (in terminal 2)"
echo "5. Open: http://localhost:3000"
