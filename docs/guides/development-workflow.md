# Development Workflow Guide

This guide outlines the complete development workflow for the RrishMusic project, including the systematic 11-step process that ensures quality and consistency.

## Overview

RrishMusic uses a milestone-driven development approach with strict quality gates and automated deployment. The project follows a multi-service platform architecture supporting Performance, Teaching, and Collaboration services.

## Branch Strategy

### Protected Main Branch
- **NO DIRECT PUSHES** to main branch allowed
- All changes must go through Pull Requests
- Main branch automatically deploys to production via GitHub Pages

### Feature Branch Naming Convention
```
feature/issue-{number}-{short-description}
```

**Examples:**
- `feature/issue-37-add-performance-credentials`
- `feature/issue-38-update-about-page-context`
- `feature/issue-44-collaboration-inquiry-form`

## The 11-Step Systematic Workflow

Every feature development follows this exact process:

### 1. Pick Task from GitHub Milestone
- Select next sequential issue within current active milestone
- Follow phase progression: 1.x.x → 2.x.x → 3.x.x → 4.x.x
- Complete each phase fully before moving to next

**Current Milestone Priority:**
- **Milestone 1**: Foundation Enhancement (Issues 1.x.x)
- **Milestone 2**: Service Integration (Issues 2.x.x) 
- **Milestone 3**: Content Optimization (Issues 3.x.x)
- **Milestone 4**: Experience Refinement (Issues 4.x.x)

### 2. Work Analysis & Planning
- Read and understand issue acceptance criteria
- Plan implementation approach with existing patterns
- Identify any dependencies or integration points

### 3. Create Feature Branch
```bash
# Start from latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/issue-{number}-{description}

# Verify clean working directory
git status
```

### 4. Implement Changes
- Follow acceptance criteria precisely
- Maintain mobile-first responsive design
- Preserve TypeScript type safety
- **NEVER break existing functionality** (especially teaching conversion paths)

### 5. Run All Quality Gates (MANDATORY)

**Before ANY commit, run complete quality pipeline:**

```bash
# Full pipeline (recommended)
npm run format && npm run type-check && npx eslint src --ext .ts,.tsx && npm run build

# Individual checks
npm run format        # Prettier formatting
npm run type-check    # TypeScript errors (tsc --noEmit)
npx eslint src --ext .ts,.tsx  # ESLint rules
npm run build         # Production build verification
```

**If any tests exist:**
```bash
npm run test          # Run test suite
npm run test:coverage # Generate coverage report
```

### 5.1 Test Failure Analysis Protocol

If tests fail, categorize each failure:

**Category A: INTENTIONAL CHANGE** ✅
- Test fails because we deliberately changed functionality
- **Action**: Update test to reflect new intended behavior

**Category B: UNINTENTIONAL REGRESSION** ❌
- Test fails because we accidentally broke existing functionality
- **Action**: Fix implementation to restore functionality (do NOT change test)

**Category C: TEST ENVIRONMENT ISSUE** ⚠️
- Test fails due to environment/mocking issues unrelated to changes
- **Action**: Fix test setup without changing functionality

**Decision Rule**: If unsure, always assume Category B first (protect existing functionality)

### 6. Commit and Push Changes

**Only commit if ALL quality gates pass:**

```bash
git add .
git commit -m "feat: descriptive commit message

- Detailed explanation of changes
- Any test updates and reasoning

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

git push origin feature/issue-{number}-{description}
```

### 7. Create Pull Request

```bash
gh pr create --title "feat: Issue Title" --body "PR Description" --assignee @me
```

**PR Description Template:**
```markdown
## Summary
Brief description of changes made

## Related Issue
Closes #[issue_number]

## Changes Made
- [ ] Specific change 1
- [ ] Specific change 2
- [ ] Specific change 3

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] All links working
- [ ] Performance acceptable

## Quality Gates
- [ ] TypeScript compilation passes
- [ ] ESLint checks pass
- [ ] Build successful
- [ ] All tests pass (if applicable)
```

### 8. Monitor PR Status (5-Check Process)

**MANDATORY monitoring with 10-second intervals:**

```bash
# Check 1-5: Wait 10 seconds between each check
sleep 10 && gh pr status
sleep 10 && gh pr status
sleep 10 && gh pr status
sleep 10 && gh pr status
sleep 10 && gh pr status
```

**After 5 checks (50 seconds total):**

**✅ If PR can be merged:**
```bash
gh pr merge --auto --squash
```

**❌ If errors found:**
- Fix issues immediately and push updates
- Restart the 5-check process
- Repeat until PR can be merged

**⏳ If checks still pending:**
- Continue monitoring with 10-second intervals
- Do not proceed until definitive result

### 9. Switch to Main, Pull Latest

```bash
git checkout main
git pull origin main
git status  # Verify clean state
```

### 10. Clean Up: Delete Branch

```bash
git branch -D feature/issue-{number}-{description}
```

### 11. Pick New Issue - Repeat Process

- Automatically return to step 1 with next sequential issue
- Continue within current milestone
- Move to next milestone only when current is complete
- Never work on multiple features simultaneously

## Commit Message Standards

### Format
```
{type}: {description}

{detailed explanation if needed}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Types
- `feat`: New features
- `style`: CSS/styling changes  
- `refactor`: Code restructuring
- `fix`: Bug fixes
- `docs`: Documentation updates

### Examples
```bash
feat: add responsive navigation header

- Implement mobile-first navigation
- Add hamburger menu for mobile devices
- Ensure accessibility compliance

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Quality Assurance

### Protected Elements (Never Break)
- Teaching conversion paths and forms
- Existing accessibility features
- Mobile responsiveness
- SEO meta tags and structured data
- Performance loading patterns
- Error boundary functionality

### Code Quality Requirements
- **TypeScript**: All components properly typed
- **Mobile-First**: Responsive design with Tailwind breakpoints
- **Accessibility**: WCAG compliance maintained
- **Performance**: Optimized images and animations
- **SEO**: Semantic HTML and meta tags

## Troubleshooting Common Issues

### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### TypeScript Errors
```bash
# Check specific errors
npm run type-check
# Fix type issues before committing
```

### ESLint Issues
```bash
# Auto-fix where possible
npx eslint src --ext .ts,.tsx --fix
```

### PR Check Failures
1. Check GitHub Actions logs
2. Run quality gates locally
3. Fix issues and push updates
4. Restart monitoring process

## Agent Delegation

When working with specialized agents:

### Supervisor Role
- Monitor progress and milestone completion
- Provide guidance when agents get stuck
- Ensure workflow continuity

### Agent Role
- Execute complete 11-step workflow for individual issues
- Report completion or request help when stuck
- Follow systematic approach without deviation

### Communication Protocol
- Agent reports: "Issue #X completed, moving to next issue"
- Supervisor responds: "Confirmed, continue with Issue #Y"
- If stuck: "Need help with [specific issue]"

This workflow ensures consistent quality, protects existing functionality, and maintains the multi-service platform transformation progress.