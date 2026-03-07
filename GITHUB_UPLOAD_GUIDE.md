# GitHub Upload Guide

## Prerequisites
- Git installed on your system
- GitHub account created
- New repository created on GitHub

---

## Step-by-Step Commands

### 1. Check Git Status
```bash
# Check if git is initialized
git status
```

If you see "fatal: not a git repository", run:
```bash
git init
```

---

### 2. Configure Git (First Time Only)
```bash
# Set your name
git config --global user.name "Your Name"

# Set your email (same as GitHub)
git config --global user.email "your.email@example.com"
```

---

### 3. Check .gitignore Files

Make sure these files exist:
- `Backend/.gitignore` ✅
- `Frontend/.gitignore` ✅

If not, create them:

**Backend/.gitignore:**
```
target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/**/target/
!**/src/test/**/target/

### STS ###
.apt_generated
.classpath
.factorypath
.project
.settings
.springBeans
.sts4-cache

### IntelliJ IDEA ###
.idea
*.iws
*.iml
*.ipr

### NetBeans ###
/nbproject/private/
/nbbuild/
/dist/
/nbdist/
/.nb-gradle/
build/
!**/src/main/**/build/
!**/src/test/**/build/

### VS Code ###
.vscode/
```

**Frontend/.gitignore:**
```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

### 4. Add All Files
```bash
# Add all files to staging
git add .

# Check what will be committed
git status
```

---

### 5. Create First Commit
```bash
git commit -m "Initial commit: Course Enrollment System with Authentication

Features:
- Student Management (CRUD)
- Course Management (CRUD)
- Enrollment Management
- JWT Authentication
- Google OAuth2 Integration
- Professional Login Page
- Protected Routes
- MongoDB Integration
- Spring Boot Backend
- React Frontend with Vite"
```

---

### 6. Connect to GitHub Repository

**Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values:**

```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify remote
git remote -v
```

---

### 7. Push to GitHub

```bash
# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use Personal Access Token (NOT your GitHub password)

---

## 🔑 Creating Personal Access Token (If Needed)

If Git asks for password and it doesn't work:

1. Go to GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. Select scopes: `repo` (full control)
5. Generate token
6. Copy the token (you won't see it again!)
7. Use this token as password when pushing

---

## 🎯 Quick Commands Summary

```bash
# Initialize git (if needed)
git init

# Configure git (first time only)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Commit
git commit -m "Initial commit: Course Enrollment System"

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push
git branch -M main
git push -u origin main
```

---

## 🔍 Verify Upload

1. Go to your GitHub repository URL
2. Check if all files are visible
3. Verify README.md is displayed properly
4. Check that node_modules and target folders are NOT uploaded

---

## 📝 Future Updates

After making changes to your code:

```bash
# Check what changed
git status

# Add changes
git add .

# Commit with message
git commit -m "Description of changes"

# Push to GitHub
git push
```

---

## 🐛 Common Issues

### Issue: "fatal: not a git repository"
**Solution:**
```bash
git init
```

### Issue: "remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Issue: "failed to push some refs"
**Solution:**
```bash
git pull origin main --rebase
git push -u origin main
```

### Issue: "Authentication failed"
**Solution:** Use Personal Access Token instead of password

---

## ✅ Checklist

Before pushing:
- [ ] Git is initialized
- [ ] .gitignore files are present
- [ ] Git user name and email configured
- [ ] GitHub repository created
- [ ] All files added and committed
- [ ] Remote origin added
- [ ] Ready to push

After pushing:
- [ ] All files visible on GitHub
- [ ] README.md displays correctly
- [ ] No node_modules or target folders uploaded
- [ ] Repository description added
- [ ] Topics/tags added (optional)

---

## 🎉 Success!

Your project is now on GitHub! Share the link:
`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

---

## 📞 Need Help?

If you face any issues:
1. Check error message carefully
2. Google the error message
3. Check GitHub documentation
4. Ask on Stack Overflow

---

**Good Luck! 🚀**
