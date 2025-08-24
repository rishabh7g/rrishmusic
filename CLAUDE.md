# RrishMusic Development Guide

This document outlines the development workflow and guidelines for the RrishMusic multi-service platform project.

## 🚀 Project Overview

Multi-service musician platform for **Rrish** - Performance | Teaching | Collaboration
- **Live Site**: https://www.rrishmusic.com
- **Repository**: https://github.com/rishabh7g/rrishmusic
- **Tech Stack**: React + TypeScript + Vite + Tailwind CSS + Framer Motion
- **Current Phase**: 4-Phase Multi-Service Platform Transformation

## 📋 Development Workflow

### Issue-Driven Development

**For every development phase:**
1. Create a **GitHub Enhancement Issue** that describes:
   - What needs to be implemented
   - Acceptance criteria
   - Design/functionality requirements
   - Phase objectives

2. For each issue:
   - Create a **single feature branch**
   - Create a **single pull request** 
   - Link PR to the issue
   - Document all changes in PR description

### Systematic Development Workflow - 11 Steps

🚫 **NO DIRECT PUSHES TO MAIN BRANCH**

✅ **Quality-Focused 11-Step Systematic Workflow:**

#### 1. **Pick Task from GitHub Issues**
- Select next priority issue from systematic GitHub issue list
- **Large Task Breakdown**: If issue is complex, break it down into smaller sub-issues first
- Focus on quality over quantity - prefer smaller, manageable tasks

#### 2. **Work Analysis & Planning**  
- Read and understand issue acceptance criteria and technical tasks
- Use guard rails for parallel agents if implementing complex features
- Plan implementation approach with existing codebase patterns

#### 3. **Create Feature Branch**
- Create feature branch: `feature/issue-{number}-{short-description}`
- Switch to clean feature branch from latest main
- Ensure working directory is clean

#### 4. **Implement Changes**
- Follow acceptance criteria precisely
- Maintain mobile-first responsive design principles
- Preserve TypeScript type safety throughout
- Protect existing functionality (especially teaching conversion paths)

#### 5. **Run All Quality Gates** - MANDATORY Before ANY Commit
```bash
# Lint Check
npm run lint

# TypeScript Errors Check  
npx tsc --noEmit

# ESLint Check
npx eslint src --ext .ts,.tsx

# Test Suite - CRITICAL REGRESSION ANALYSIS
npm run test

# Build Verification
npm run build
```

#### 4.1 **Test Failure Analysis Protocol** 🚨
**If tests fail after implementation, MANDATORY analysis:**

**Step 1: Identify Test Failures**
```bash
# Run tests with verbose output
npm run test -- --verbose

# Generate coverage report to see what changed
npm run test:coverage
```

**Step 2: Categorize Each Failure**
For each failing test, determine the category:

**Category A: INTENTIONAL CHANGE** ✅ **Valid Failure**
- Test fails because we deliberately changed functionality
- Example: Navigation order changed from Home→About→Contact to Performances→Home→About→Contact
- **Action**: Update test to reflect new intended behavior

**Category B: UNINTENTIONAL REGRESSION** ❌ **Critical Issue**
- Test fails because we accidentally broke existing functionality  
- Example: Teaching conversion path broken, accessibility removed
- **Action**: Fix implementation to restore functionality (do NOT change test)

**Category C: TEST ENVIRONMENT ISSUE** ⚠️ **Investigation Needed**
- Test fails due to environment/mocking/timing issues unrelated to our changes
- Example: Mock setup changed, async timing issues, dependency conflicts
- **Action**: Fix test setup without changing functionality

**Step 3: Decision Matrix**
```
Test Failure Category → Action Required
├── Category A (Intentional) → Update test cases to match new behavior
├── Category B (Regression) → Fix implementation, keep tests unchanged  
├── Category C (Environment) → Fix test setup/mocking
└── If unsure → ALWAYS assume Category B first (protect existing functionality)
```

**Step 4: Document Decisions**
In commit message, document test changes:
```
feat: add performance navigation

- Updated Navigation.test.tsx: Changed expected order to include Performances (Category A)
- Fixed About.test.tsx: Restored accessibility attributes that were accidentally removed (Category B)
- Updated test mocks: Fixed navigation constant imports (Category C)

Test Analysis:
- 3 tests updated for intentional navigation changes
- 1 implementation fix for accessibility regression
- 2 test environment fixes

🤖 Generated with [Claude Code](https://claude.ai/code)
```

#### 4.2 **Multi-Service Transformation Protected Elements** 🛡️
**NEVER break these during transformation (Category B if they fail):**
- Teaching conversion paths and forms
- Existing accessibility features
- Mobile responsiveness 
- SEO meta tags and structured data
- Performance loading patterns
- Error boundary functionality

#### 6. **Commit and Push Changes**
- Only commit if ALL quality gates pass AND test analysis complete
- Document any test changes in commit message  
- Use standardized commit message format
- Push changes to feature branch

#### 7. **Create PR with Auto-Merge Enabled**
- Create PR with detailed description
- Link to GitHub issue: `Closes #[issue_number]`
- **Enable auto-merge**: `gh pr merge --auto --squash`
- Include comprehensive testing checklist

#### 8. **Monitor PR Status Until Merged**
- **Continuously monitor PR status** until merged
- Watch for CI/CD failures, merge conflicts, or review requests
- Fix any issues immediately and push updates
- **Auto-merge will complete when all checks pass**

#### 9. **Switch to Main, Pull Latest**
- Switch to main branch and pull latest changes
```bash
git checkout main
git pull origin main
git status  # Verify clean state
```

#### 10. **Clean Up: Delete Branch**
- Delete local feature branch after switching to main
```bash
git branch -D feature/issue-{number}-{description}
```

#### 11. **Pick New Issue from Git - Start Process Again**
- **Automatically** return to step 1 with next priority issue
- Ensure main branch is clean before starting new feature
- **Never work on multiple features simultaneously**
- **Repeat process until no GitHub issues remain**
- **No asking for permission** - continue workflow automatically

### Branch Naming Convention

```
feature/issue-{number}-{short-description}
```

**Examples:**
- `feature/issue-1-phase2-basic-styling`
- `feature/issue-2-contact-form`
- `feature/issue-3-instagram-integration`

### Commit Message Standards

```
{type}: {description}

{detailed explanation if needed}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat`: New features
- `style`: CSS/styling changes
- `refactor`: Code restructuring
- `fix`: Bug fixes
- `docs`: Documentation updates

**Examples:**
```
feat: add responsive navigation header

- Implement mobile-first navigation
- Add hamburger menu for mobile devices
- Ensure accessibility compliance

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Pull Request Template

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

## Screenshots/Demo
[Add screenshots or demo links if applicable]

## Phase Completion
- [ ] All acceptance criteria met
- [ ] Code follows project conventions
- [ ] Ready for next phase
```

## 🎯 Multi-Service Platform Transformation Phases

### Phase 1: Foundation Enhancement (Weeks 1-2) ⚡ ACTIVE
**Current Implementation**
- **1.1**: Navigation & Information Architecture
  - ✅ Issues #25-26: Add Performance Services Navigation
- **1.2**: Performance Landing Page Development  
  - ✅ Issues #27-29: Create Performance Services Landing Page
- **1.3**: About Page Enhancement
  - ✅ Issues #37-38: Add Performance Credentials

### Phase 2: Service Integration (Weeks 3-4) 📋 PLANNED
**Collaboration & Contact Systems**
- **2.1**: Collaboration Services Implementation (Issues #39, #41)
- **2.2**: Context-Aware Contact System (Issues #42, #44-45)  
- **2.3**: Contact Routing Implementation (Issues #47-48)

### Phase 3: Content Optimization (Weeks 5-6) 🎨 PLANNED
**Homepage & Content Hierarchy**  
- **3.1**: Homepage Redesign (Issues #30, #33, #35)
- **3.2**: Content Hierarchy Implementation (Issues #40, #43)
- **3.3**: Social Proof Integration (Issues #46, #49)

### Phase 4: Experience Refinement (Weeks 7-8) 🚀 PLANNED
**Advanced Optimization**
- **4.1**: Advanced Contact Optimization (Issues #31-32)
- **4.2**: Cross-Service Optimization (Issues #34, #36)

## 🛠️ Code Quality Guidelines

### React + TypeScript
- **Type Safety**: All components and functions must be properly typed
- **Component Architecture**: Follow existing patterns in `/src/components/`
- **Hooks Usage**: Use existing custom hooks (`useContent`, `usePageSEO`, etc.)
- **Error Boundaries**: Implement error handling for new components

### Mobile-First Responsive Design
- **Breakpoints**: Use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`)
- **Overflow Prevention**: Always use `overflow-x: hidden` for mobile
- **Touch Targets**: Minimum 44px touch targets for mobile interactions
- **Performance**: Optimize images and animations for mobile devices

### Multi-Service Architecture
- **Service Separation**: Clear boundaries between Performance, Teaching, and Collaboration
- **Content Management**: Use modular JSON architecture in `/src/data/`
- **Navigation Priority**: Performance → Teaching → About → Contact hierarchy
- **Conversion Protection**: Never break existing teaching conversion paths

### Accessibility & SEO
- **WCAG Compliance**: Meet accessibility standards for all new components
- **SEO Optimization**: Use semantic HTML and proper meta tags
- **Screen Readers**: Test with screen reader navigation
- **Keyboard Navigation**: Ensure full keyboard accessibility

## 📝 Documentation Requirements

- Update README.md for significant changes
- Document any new dependencies
- Keep CLAUDE.md updated with workflow changes
- Add comments for complex functionality

## 🔄 Deployment

- **Automatic**: GitHub Pages deploys from main branch
- **Domain**: Changes to CNAME require DNS propagation time
- **Testing**: Always test on staging branch before merging

---

---

## 🔄 Multi-Service Platform Commands

### Quality Gate Commands (Run Before Every Commit)
```bash
# Full quality check pipeline
npm run lint && npx tsc --noEmit && npx eslint src --ext .ts,.tsx && npm run build

# Individual checks
npm run lint          # Prettier/formatting
npx tsc --noEmit      # TypeScript errors  
npx eslint src --ext .ts,.tsx  # ESLint rules
npm run test          # Test suite (if exists)
npm run build         # Production build verification
```

### PR Workflow Commands
```bash
# Create PR with auto-merge
gh pr create --title "feat: Issue Title" --body "PR Description" --assignee @me
gh pr merge --auto --squash

# Monitor PR status  
gh pr status
gh pr view [PR_NUMBER]

# Fix PR issues and update
git add . && git commit -m "fix: address PR feedback" && git push
```

### Branch Management Commands
```bash
# Post-merge cleanup
git checkout main && git pull origin main
git branch -D feature/issue-{number}-{description}

# Start new feature
git checkout -b feature/issue-{number}-{description}
```

---

**Last Updated**: August 2025  
**Current Phase**: Phase 1 - Foundation Enhancement (Issue #25 Active)  
**Next Milestone**: Complete navigation integration and performance landing page