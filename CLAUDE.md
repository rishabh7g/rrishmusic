# RrishMusic Development Guide

This document outlines the development workflow and guidelines for the RrishMusic website project.

## 🚀 Project Overview

Personal website for **Rrish** - Music Teacher & Blues Improviser
- **Live Site**: http://www.rrishmusic.com
- **Repository**: https://github.com/rishabh7g/rrishmusic
- **Tech Stack**: React + TypeScript + Vite (Current) with modular JSON data architecture
- **Deployment**: GitHub Pages with custom domain

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

### Git Workflow Rules

🚫 **NO DIRECT PUSHES TO MAIN BRANCH**

✅ **Required Workflow for PR Creation:**
1. Create GitHub issue for the phase/feature
2. **IMPORTANT**: Update local main branch first:
   ```bash
   git checkout main
   git pull origin main
   ```
3. Create feature branch from updated main:
   ```bash
   git checkout -b feature/branch-name
   ```
4. Implement changes in feature branch
5. **Before creating PR**: Sync feature branch with latest main:
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/branch-name
   git rebase main
   # OR: git pull origin main --rebase
   ```
6. Create Pull Request with detailed description and `--auto-merge` flag
7. Code review (if applicable)
8. Auto-merge when checks pass
9. Delete feature branch
10. Return to main and pull latest changes

### Branch Naming Convention

```
feature/issue-{number}-{short-description}
fix/{short-description}
chore/{short-description}
```

**Examples:**
- `feature/issue-1-phase2-basic-styling`
- `feature/content-management-system`
- `fix/sitecontent-reference-error`
- `chore/update-dependencies`

### Commit Message Standards

```
{type}: {description}

{detailed explanation if needed}

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes (critical issues that break functionality)
- `chore`: Maintenance tasks (dependencies, configs, empty commits)
- `style`: CSS/styling changes
- `refactor`: Code restructuring without changing functionality
- `docs`: Documentation updates
- `test`: Adding or modifying tests
- `perf`: Performance improvements

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

## 🎯 Development Phases

### ✅ Phase 1: React Migration & Core Architecture (COMPLETED)
- React + TypeScript + Vite setup
- Component architecture with sections
- Performance optimizations (lazy loading, error boundaries)
- SEO implementation with dynamic meta tags
- Custom hooks for content management

### ✅ Phase 2: Modular Data Architecture (COMPLETED)
- Eliminated hardcoded data from TypeScript components
- Implemented modular JSON data files by category
- Created centralized statistics with no redundancy
- Added realistic personal data (1 year teaching, 2 students)
- Single source of truth for all content

### ✅ Phase 3: Production Optimizations (COMPLETED)
- Comprehensive error handling and boundaries
- Performance monitoring and optimization
- Testing infrastructure with Vitest
- ESLint configuration and code quality
- Git workflow improvements

### 📋 Phase 4: Content Enhancement (PLANNED)
**Future improvements:**
- Instagram feed integration
- Music samples/audio player
- Advanced testimonial management
- Contact form functionality
- Booking system integration

## 🛠️ Code Quality Guidelines

### React/TypeScript
- Use functional components with hooks
- Implement proper TypeScript interfaces for all data
- Follow React best practices (keys, children, performance)
- Use custom hooks for data management and logic separation
- Implement error boundaries for graceful error handling

### Data Architecture
- **NEVER** hardcode data in TypeScript components
- Use modular JSON files organized by content category
- Import JSON data directly in hooks, not components
- Maintain single source of truth for statistics
- Use computed values for derived data

### Performance
- Implement lazy loading for code splitting
- Use `useMemo` and `useCallback` for expensive operations
- Add loading states and skeleton loaders
- Optimize bundle size and asset loading

### Testing
- Maintain minimal viable test suite for CI/CD
- Use Vitest for unit testing
- Mock complex dependencies properly
- Gradually expand test coverage

### Error Handling
- Implement comprehensive error boundaries
- Provide fallback content for failed components
- Log errors appropriately without exposing sensitive data

## 📝 Documentation Requirements

- Update README.md for significant changes
- Document any new dependencies
- Keep CLAUDE.md updated with workflow changes and lessons learned
- Add TypeScript interfaces and JSDoc comments
- Create GitHub issues for all significant problems and their solutions
- Maintain performance optimization documentation

## 🔄 Deployment

- **Automatic**: GitHub Pages deploys from main branch
- **Domain**: http://www.rrishmusic.com (HTTP protocol)
- **Testing**: Always test locally with `npm run dev` before merging
- **Quality Checks**: Run `npm run type-check` and `npm run lint` before commits

## 🚨 Common Mistakes & Solutions

### Critical Errors Encountered:

#### 1. Undefined Variable References (FIXED)
**Problem**: `ReferenceError: Can't find variable: siteContent`
- **Root Cause**: References to undefined variables after modular architecture migration
- **Solution**: Construct content objects from imported JSON files using `useMemo`
- **Prevention**: Always ensure all variables are properly defined and imported
- **PR**: #20

#### 2. React Key & Children Errors (FIXED)
**Problem**: Duplicate keys and invalid React children
- **Root Cause**: Using objects as keys and rendering objects directly
- **Solution**: Use unique string/number keys and render object properties
- **Prevention**: Always use unique identifiers for keys, render primitives not objects

#### 3. Hardcoded Data Issues (FIXED)
**Problem**: Statistics and content hardcoded in components
- **Root Cause**: Data mixed with presentation logic
- **Solution**: Extract all data to JSON files, use hooks for data access
- **Prevention**: Never put data directly in TSX files, always use external sources

#### 4. Git Branch Synchronization (SOLVED)
**Problem**: Feature branches falling behind main, merge conflicts
- **Root Cause**: Not syncing with main before creating PRs
- **Solution**: Always rebase feature branch with main before PR creation
- **Prevention**: Follow the updated Git workflow above

### ESLint & TypeScript Issues:
- **Problem**: Configuration conflicts and rule violations
- **Solution**: Use modern flat config, separate component and utility exports
- **Prevention**: Run `npm run lint` and `npm run type-check` before commits

### Testing Issues:
- **Problem**: Complex mocking and React 19 compatibility
- **Solution**: Start with simple tests, gradually expand coverage
- **Prevention**: Mock external dependencies early, use lightweight alternatives

## 🛡️ Development Best Practices

1. **Always** pull latest main before creating feature branches
2. **Never** commit changes without running type-check and lint
3. **Always** test app functionality with `npm run dev` before pushing
4. **Use** auto-merge for PRs to maintain clean workflow
5. **Create** GitHub issues for all significant problems and solutions
6. **Update** CLAUDE.md when encountering new problems or solutions
7. **Maintain** modular data architecture - no hardcoded data in components
8. **Implement** proper error boundaries and loading states
9. **Follow** semantic commit message standards
10. **Document** all architectural decisions and their rationale

---

**Last Updated**: August 2025  
**Next Review**: After Phase 4 planning