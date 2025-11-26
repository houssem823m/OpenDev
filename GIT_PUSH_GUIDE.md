# How to Push Updates to GitHub

## Quick Steps

### 1. Check Current Status
```bash
cd "C:\Users\05ax\Desktop\Coding Projects\learn by testing (big projects)\OpenDev"
git status
```

### 2. Stage Your Changes
Stage all modified files:
```bash
git add .
```

Or stage specific files:
```bash
git add app/api/uploadthing/route.ts
git add app/api/uploadthing/core.ts
git add scripts/test-uploadthing.ts
git add app/api/test-uploadthing/route.ts
```

### 3. Commit Your Changes
```bash
git commit -m "Update UploadThing to v7 and fix callback configuration"
```

### 4. Push to GitHub
```bash
git push origin main
```

If you're on a different branch:
```bash
git push origin <branch-name>
```

## Complete Workflow Example

```powershell
# Navigate to project directory
cd "C:\Users\05ax\Desktop\Coding Projects\learn by testing (big projects)\OpenDev"

# Check what files have changed
git status

# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "feat: upgrade to UploadThing v7 with improved callback handling"

# Push to GitHub
git push origin main
```

## Useful Git Commands

### View Changes
```bash
# See what files changed
git status

# See detailed changes in files
git diff

# See changes in a specific file
git diff app/api/uploadthing/route.ts
```

### Check Remote
```bash
# View remote repository
git remote -v

# Check if you have unpushed commits
git log origin/main..HEAD --oneline
```

### Undo Changes (if needed)
```bash
# Unstage a file (keeps changes)
git reset HEAD <file>

# Discard changes in a file
git checkout -- <file>

# Discard all uncommitted changes
git reset --hard HEAD
```

## Current Repository Info

- **Remote**: `https://github.com/houssem823m/OpenDev.git`
- **Current Branch**: `main`
- **Status**: All changes are committed and pushed ✓

