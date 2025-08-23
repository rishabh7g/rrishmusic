# RrishMusic Development Guide

This document outlines the development workflow and guidelines for the RrishMusic website project.

## 🚀 Project Overview

Personal website for **Rrish** - Music Teacher & Blues Improviser
- **Live Site**: https://www.rrishmusic.com
- **Repository**: https://github.com/rishabh7g/rrishmusic
- **Tech Stack**: HTML, CSS, JavaScript (Phase 1-2) → Future migration to React/Next.js

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

✅ **Required Workflow:**
1. Create GitHub issue for the phase/feature
2. Create feature branch from main
3. Implement changes in feature branch
4. Create Pull Request with detailed description
5. Code review (if applicable)
6. Merge PR to main branch
7. Delete feature branch

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

## 🎯 Development Phases

### ✅ Phase 1: Minimal Viable Website (COMPLETED)
- Basic HTML structure
- GitHub Pages deployment
- Custom domain configuration
- Instagram contact link

### 📋 Phase 2: Enhanced Content & Basic Styling (PLANNED)
**Issue to be created:**
- Basic CSS styling and layout
- Proper sections (About, Teaching, Contact)
- Typography improvements
- Mobile responsiveness
- Email contact addition

### 📋 Phase 3: Rich Content & Interactive Features (PLANNED) 
**Issue to be created:**
- Instagram feed integration
- Music samples/recordings
- Rate card page
- Enhanced design/branding

### 📋 Phase 4: Advanced Features (FUTURE)
**Issue to be created:**
- Contact forms
- Booking system
- Technology migration (React/Next.js)

## 🛠️ Code Quality Guidelines

### HTML
- Use semantic HTML elements
- Maintain accessibility standards
- Structure for future React migration

### CSS
- Mobile-first responsive design
- Use CSS custom properties for theming
- Component-based organization

### JavaScript
- Write modular, reusable code
- Follow ES6+ standards
- Prepare for framework migration

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

**Last Updated**: August 2025  
**Next Review**: Before Phase 2 implementation