# .gitignore Configuration

## Important: Protect Your Credentials

Your `.env` file contains sensitive credentials. **NEVER commit it to Git!**

---

## How to Protect `.env`

### Option 1: Add to `.gitignore` (Recommended)

If `.gitignore` doesn't exist in your project, create one:

**File:** `.gitignore` in project root

```
# Environment variables - NEVER COMMIT!
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
```

### Option 2: If `.gitignore` already exists

Just add this line:
```
.env
```

---

## Verify `.env` is Protected

### Check Git Status
```bash
git status
```

**Should NOT show** `.env` file  
**Should show** `.env.example` file (if you created it)

### Safe to Commit
✅ `.env.example` (template, no secrets)  
✅ `.gitignore` (protection rules)  
✅ All source files (server.js, package.json, etc.)  

### NEVER Commit
❌ `.env` (contains credentials)  
❌ Any file with passwords  
❌ API keys or secrets  

---

## What to Share with Team

### Safe to Share
✅ `.env.example` - Template showing structure
✅ Documentation - All `.md` files
✅ Source code - All `.js` files
✅ Configuration - `package.json`, etc.

### NOT Safe to Share
❌ `.env` - Contains real credentials
❌ Screenshots with credentials visible
❌ Console logs with API keys
❌ Private keys or passwords

---

## Production Deployment

### Before Pushing to Production

1. **Verify `.gitignore` includes `.env`:**
   ```bash
   cat .gitignore | grep .env
   ```

2. **Make sure `.env` is NOT in Git history:**
   ```bash
   git log --all --full-history -- .env
   ```

3. **If `.env` was accidentally committed:**
   ```bash
   # Remove from Git (but keep local copy)
   git rm --cached .env
   
   # Add .env to .gitignore
   echo ".env" >> .gitignore
   
   # Commit the removal
   git add .gitignore
   git commit -m "Remove .env from version control"
   ```

4. **Deploy `.env` separately:**
   - Use your hosting platform's secrets/env variables
   - Store securely (AWS Secrets Manager, Azure Key Vault, etc.)
   - Never commit to repository

---

## For Your Team/Collaborators

### Setup Instructions

**1. Clone the repository:**
```bash
git clone <repository-url>
cd fieldtrip-club
```

**2. Install dependencies:**
```bash
npm install
```

**3. Create `.env` from `.env.example`:**
```bash
# On Linux/Mac
cp .env.example .env

# On Windows
copy .env.example .env
```

**4. Fill in credentials:**
Edit `.env` and add:
- EMAIL credentials
- JWT secret
- MPesa credentials

**5. Start the server:**
```bash
npm start
```

---

## CI/CD (GitHub Actions, etc.)

### Setting Environment Variables

**In your CI/CD pipeline, use secrets:**

```yaml
# Example: GitHub Actions
name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Start Server
        env:
          PORT: ${{ secrets.PORT }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          EMAIL_USER: ${{ secrets.EMAIL_USER }}
          EMAIL_PASSWORD: ${{ secrets.EMAIL_PASSWORD }}
          MPESA_CONSUMER_KEY: ${{ secrets.MPESA_CONSUMER_KEY }}
          MPESA_CONSUMER_SECRET: ${{ secrets.MPESA_CONSUMER_SECRET }}
          MPESA_SHORTCODE: ${{ secrets.MPESA_SHORTCODE }}
          MPESA_CALLBACK_URL: ${{ secrets.MPESA_CALLBACK_URL }}
        run: npm start
```

---

## Current Status

### Your Project
```
fieldtrip-club/
├── .env                  ← ✅ Created (PROTECTED!)
├── .env.example          ← ✅ Shared with team
├── .gitignore            ← Add if needed
├── server.js             ← ✅ Uses .env
└── ... other files
```

### Next Step
**Add to your `.gitignore`:**
```
.env
```

---

## Quick Commands

```bash
# Check if .env is protected
git status              # Should NOT show .env

# Verify .gitignore
cat .gitignore         # Should include: .env

# Check git config
git config core.excludesfile

# See what would be committed
git status --ignored
```

---

## ✅ Checklist

- [ ] `.env` file created with credentials
- [ ] `.env` added to `.gitignore`
- [ ] Git status shows `.env` is excluded
- [ ] `.env.example` created (optional but recommended)
- [ ] `.env` not in Git history
- [ ] Team knows NOT to share `.env`
- [ ] Production setup uses secrets manager
- [ ] All credentials safely stored

---

## 🎯 Summary

### PROTECT YOUR CREDENTIALS

1. **Create `.gitignore`** with:
   ```
   .env
   ```

2. **Never commit** `.env` file

3. **Only share** `.env.example` with team

4. **For production** use secrets manager

5. **Keep `.env` safe** locally

**Your credentials are secure when `.env` is in `.gitignore`!** ✅
