# Git Setup Guide

## Initial Git Setup

If you haven't initialized git yet, run these commands from the project root:

```bash
git init
git add .
git commit -m "Initial commit: Asymmetric Cryptography demo application"
```

## If Files Were Already Tracked

If you already committed files before adding .gitignore (like node_modules or .env), you need to remove them from git tracking:

### Remove all ignored files from git
```bash
# Remove all files from git index (but keep them on disk)
git rm -r --cached .

# Re-add all files (this time respecting .gitignore)
git add .

# Commit the changes
git commit -m "Fix: Apply .gitignore rules"
```

### Remove specific files/folders
```bash
# Remove node_modules from git tracking
git rm -r --cached backend/node_modules
git rm -r --cached frontend/node_modules

# Remove .env files
git rm --cached backend/.env

# Commit the changes
git commit -m "Remove ignored files from git tracking"
```

## Verify .gitignore is Working

Check which files will be added:
```bash
git status
```

You should NOT see:
- `node_modules/` directories
- `.env` files
- `dist/` or `build/` directories
- Editor files like `.vscode/` or `.DS_Store`

## What Gets Ignored

### Root Level (.gitignore)
- node_modules/
- .env files
- dist/ and build/
- OS files (.DS_Store, Thumbs.db)
- IDE files (.vscode/, .idea/)
- Log files (*.log)

### Backend (backend/.gitignore)
- node_modules/
- .env and environment files
- logs/
- temporary files

### Frontend (frontend/.gitignore)
- node_modules/
- dist/ and dist-ssr/
- .env files
- editor directories
- build outputs

## Create a Remote Repository

### GitHub
```bash
# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/asymmetric-crypto.git
git branch -M main
git push -u origin main
```

### GitLab
```bash
git remote add origin https://gitlab.com/yourusername/asymmetric-crypto.git
git branch -M main
git push -u origin main
```

## Important Files to Commit

✅ **DO commit:**
- All source code (.js, .jsx files)
- Configuration files (package.json, vite.config.js, tailwind.config.js)
- Documentation (.md files)
- Public assets
- README and setup guides

❌ **DO NOT commit:**
- node_modules/
- .env files (contains secrets)
- dist/ or build/ directories
- Log files
- Editor-specific files
- OS-specific files

## .env File Template

Create a `.env.example` file (safe to commit) with dummy values:

**backend/.env.example:**
```
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Then everyone can copy it:
```bash
cp backend/.env.example backend/.env
```

## Useful Git Commands

```bash
# Check status
git status

# See what's ignored
git status --ignored

# Check if a file is ignored
git check-ignore -v filename

# View .gitignore patterns
cat .gitignore
cat backend/.gitignore
cat frontend/.gitignore
```

## Troubleshooting

### .gitignore not working?
```bash
# Clear git cache and re-add files
git rm -r --cached .
git add .
git commit -m "Fix .gitignore"
```

### Still seeing node_modules?
```bash
# Force remove from git
git rm -rf --cached node_modules
git commit -m "Remove node_modules"
```

### .env still tracked?
```bash
# Remove from git
git rm --cached backend/.env
git commit -m "Remove .env from tracking"

# Verify it's now ignored
git status
```

## Best Practices

1. **Always add .gitignore BEFORE first commit**
2. **Never commit sensitive data** (.env, API keys, passwords)
3. **Keep .gitignore updated** as project grows
4. **Use .env.example** for sharing configuration structure
5. **Check git status** before committing
6. **Review .gitignore** when adding new dependencies

## Project-Specific Ignore Rules

Our project ignores:
- `backend/node_modules/` - Backend dependencies
- `frontend/node_modules/` - Frontend dependencies
- `backend/.env` - Environment variables
- `frontend/dist/` - Frontend build output
- `*.log` - All log files
- `.DS_Store` - macOS files
- `.vscode/` - VS Code settings

## Clean Repository Checklist

✓ .gitignore files in place (root, backend, frontend)
✓ node_modules/ not in git
✓ .env files not in git  
✓ Build outputs not in git
✓ All source code is committed
✓ Documentation is committed
✓ Configuration files are committed

Run this to verify:
```bash
git status
```

If you see only source files and configs, you're good to go!
