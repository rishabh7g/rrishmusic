# Deployment Guide

This guide explains the deployment process for the RrishMusic project, including GitHub Pages configuration, custom domain setup, and troubleshooting common deployment issues.

## Deployment Overview

RrishMusic uses GitHub Pages for automated deployment with the following setup:
- **Platform**: GitHub Pages
- **Source**: GitHub Actions (automated)
- **Domain**: Custom domain (www.rrishmusic.com)
- **Build Tool**: Vite
- **Trigger**: Push to main branch

## Automatic Deployment Workflow

### GitHub Actions Configuration

The project uses GitHub Actions for automated builds and deployments:

**Location**: `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run type check
      run: npm run type-check
      
    - name: Build project
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### Deployment Trigger

Deployment automatically triggers when:
1. Code is pushed to `main` branch
2. Pull Request is merged to `main` branch
3. Direct commit is made to `main` branch (not recommended)

### Build Process

1. **Install Dependencies**: `npm ci`
2. **Type Check**: `npm run type-check` 
3. **Build**: `npm run build` (creates `/dist` folder)
4. **Deploy**: Upload `/dist` contents to `gh-pages` branch

## Custom Domain Configuration

### Domain Setup

**Current Configuration**:
- Primary Domain: `www.rrishmusic.com`
- Redirect: `rrishmusic.com` → `www.rrishmusic.com`

### CNAME Configuration

**Location**: `/public/CNAME`
```
www.rrishmusic.com
```

### DNS Configuration

Required DNS records at domain provider:
```
Type: CNAME
Name: www
Value: rishabh7g.github.io

Type: A (Apex domain redirect)
Name: @
Value: 185.199.108.153
Value: 185.199.109.153  
Value: 185.199.110.153
Value: 185.199.111.153
```

### GitHub Pages Settings

In GitHub repository settings → Pages:
- **Source**: Deploy from a branch
- **Branch**: `gh-pages` / `root`
- **Custom Domain**: `www.rrishmusic.com`
- **Enforce HTTPS**: ✅ Enabled

## Local Development vs Production

### Development Server
```bash
npm run dev
# Runs on http://localhost:5173
# Hot reload enabled
# Source maps available
```

### Production Build
```bash
npm run build
# Creates optimized build in /dist
# Minified assets
# Production optimizations applied
```

### Preview Production Build
```bash
npm run preview
# Serves production build locally
# Test production behavior before deployment
```

## Deployment Checklist

Before deploying changes:

### 1. Code Quality
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] Code formatted (`npm run format`) 
- [ ] ESLint checks pass (`npx eslint src --ext .ts,.tsx`)
- [ ] Build succeeds (`npm run build`)

### 2. Content Verification
- [ ] All images optimized and accessible
- [ ] Links working correctly
- [ ] Contact forms functional
- [ ] SEO meta tags updated

### 3. Responsive Testing  
- [ ] Mobile layout correct
- [ ] Tablet layout functional
- [ ] Desktop layout optimal
- [ ] All breakpoints tested

### 4. Performance Check
- [ ] Images lazy loading
- [ ] Bundle size acceptable
- [ ] Core Web Vitals optimized
- [ ] Loading speed satisfactory

## Monitoring Deployment

### GitHub Actions Status

Monitor deployment in GitHub repository:
1. Go to **Actions** tab
2. Check latest workflow run
3. Review build logs for errors
4. Verify successful deployment

### Deployment Status Indicators

**✅ Successful Deployment**:
- Green checkmark in Actions
- Changes visible on live site
- No error messages

**❌ Failed Deployment**:
- Red X in Actions  
- Error logs in workflow
- Site shows previous version

### Live Site Verification

After deployment, verify:
```bash
# Check site is accessible
curl -I https://www.rrishmusic.com

# Verify specific pages
curl -I https://www.rrishmusic.com/performance
curl -I https://www.rrishmusic.com/teaching
curl -I https://www.rrishmusic.com/collaboration
```

## Troubleshooting Common Issues

### 1. Build Failures

**TypeScript Errors**:
```bash
# Check for type errors
npm run type-check

# Common fixes:
# - Add missing type definitions
# - Fix component prop types
# - Resolve import/export issues
```

**Build Process Errors**:
```bash
# Clear cache and retry
rm -rf node_modules/.vite
npm run build

# Check for:
# - Missing dependencies
# - Import path issues
# - Asset loading problems
```

### 2. Deployment Not Triggering

**Check GitHub Actions**:
- Verify workflow file exists: `.github/workflows/deploy.yml`
- Check Actions tab for failed runs
- Ensure main branch protection rules allow deployments

**Fix Common Issues**:
```bash
# Ensure main branch is up to date
git checkout main
git pull origin main

# Check for uncommitted changes
git status

# Verify push succeeded
git log --oneline -5
```

### 3. Site Not Updating

**Cache Issues**:
- Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Check incognito/private browsing

**DNS Issues**:
```bash
# Check DNS propagation
nslookup www.rrishmusic.com

# Verify CNAME record
dig www.rrishmusic.com CNAME
```

### 4. Custom Domain Issues

**CNAME Problems**:
- Verify `/public/CNAME` contains correct domain
- Check GitHub Pages settings show correct custom domain
- Ensure DNS records point to GitHub Pages IPs

**SSL Certificate Issues**:
- Wait 24-48 hours for certificate provisioning
- Verify "Enforce HTTPS" is enabled in GitHub settings
- Check certificate status in browser

### 5. Asset Loading Issues

**Images Not Loading**:
```typescript
// Ensure correct public path references
<img src="/images/performance/venue.jpg" alt="..." />
// NOT: <img src="./images/..." /> or <img src="images/..." />
```

**CSS/JS Not Loading**:
- Verify build output in `/dist` folder
- Check browser network tab for 404 errors
- Ensure Vite build configuration correct

## Environment-Specific Configuration

### Development Environment
```typescript
// vite.config.ts - development
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
});
```

### Production Environment
```typescript
// vite.config.ts - production considerations
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser'
  },
  base: '/' // Adjust if using subdirectory
});
```

## Performance Monitoring

### Build Size Analysis
```bash
# Analyze bundle size
npm run build
ls -la dist/assets/

# Consider bundle analyzer for detailed breakdown
npm install --save-dev rollup-plugin-analyzer
```

### Core Web Vitals
Monitor key metrics:
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms  
- **CLS** (Cumulative Layout Shift): < 0.1

### Performance Tools
- Google PageSpeed Insights
- Lighthouse (Chrome DevTools)
- WebPageTest.org
- GitHub Pages site analytics

## Rollback Procedures

### Emergency Rollback

If deployment causes critical issues:

1. **Immediate**: Revert in GitHub
```bash
# Find last working commit
git log --oneline

# Create emergency fix branch
git checkout -b emergency-rollback-[timestamp]

# Revert problematic commit
git revert [commit-hash]

# Push to trigger new deployment  
git push origin emergency-rollback-[timestamp]

# Create immediate PR to main
gh pr create --title "Emergency Rollback" --body "Rolling back critical issue"
```

2. **Alternative**: Redeploy Previous Version
- Go to Actions tab in GitHub
- Find last successful deployment
- Click "Re-run jobs" to redeploy that version

### Planned Rollbacks

For planned rollbacks:
1. Identify commit to rollback to
2. Create rollback branch
3. Cherry-pick or revert specific changes
4. Follow normal PR process
5. Deploy through standard workflow

## Security Considerations

### Repository Security
- Never commit sensitive data (API keys, passwords)
- Use GitHub Secrets for sensitive configuration
- Regularly update dependencies

### Site Security
- HTTPS enforced via GitHub Pages
- No server-side processing (static site)
- Regular security audits of dependencies

```bash
# Check for vulnerabilities
npm audit
npm audit fix
```

This guide ensures reliable deployments and quick resolution of deployment issues for the RrishMusic platform.