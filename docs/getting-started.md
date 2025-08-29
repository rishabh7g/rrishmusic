# Getting Started with RrishMusic

Welcome to the RrishMusic development team! This guide will get you up and running quickly and point you to all the resources you need.

## 🎵 What is RrishMusic?

RrishMusic is a multi-service musician platform for **Rrish**, offering three core services:

- **🎸 Performance Services** - Live music for events, venues, and special occasions
- **📚 Teaching Services** - Music lessons and educational programs  
- **🤝 Collaboration Services** - Musical partnerships and creative projects

**Live Site**: [www.rrishmusic.com](https://www.rrishmusic.com)
**Repository**: [github.com/rishabh7g/rrishmusic](https://github.com/rishabh7g/rrishmusic)

## ⚡ Quick Start (5 Minutes)

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Git** 

### Get Running Locally

```bash
# 1. Clone the repository
git clone https://github.com/rishabh7g/rrishmusic.git
cd rrishmusic

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open your browser
# Visit http://localhost:5173
```

That's it! You should now see the RrishMusic website running locally.

## 🏗️ Project Structure Overview

```
rrishmusic/
├── src/                          # Main application code
│   ├── components/               # React components
│   │   ├── pages/               # Page components (Home, Performance, etc.)
│   │   ├── sections/            # Page sections (Hero, About, etc.)
│   │   ├── forms/               # Contact and inquiry forms
│   │   └── ui/                  # Reusable UI components
│   ├── content/                 # JSON content files
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Utility functions
│   └── types/                   # TypeScript type definitions
├── docs/                        # Documentation (you are here!)
├── CLAUDE.md                    # Detailed development workflow
└── README.md                    # Basic project info
```

### Key Technologies
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Content Management**: JSON-based content system
- **Deployment**: GitHub Pages

## 🚀 Development Workflow

### For Detailed Development Process
**👆 Read this first**: [`CLAUDE.md`](../CLAUDE.md)

The complete development workflow with:
- 11-step systematic development process
- Quality gates and testing requirements  
- Branch naming conventions
- Commit message standards
- PR workflow with auto-merge

### Quick Commands Reference

```bash
# Development
npm run dev                      # Start dev server
npm run build                    # Build for production
npm run preview                  # Preview production build

# Code Quality (run before every commit)
npm run lint                     # Format with Prettier
npx tsc --noEmit                # TypeScript type checking
npx eslint src --ext .ts,.tsx   # ESLint checks
```

## 📚 Documentation Navigation

| Document | Purpose | When to Read |
|----------|---------|--------------|
| **`docs/getting-started.md`** | **You are here!** Main entry point | **Read first** |
| [`CLAUDE.md`](../CLAUDE.md) | Complete development workflow | Before making any changes |
| [`README.md`](../README.md) | Basic project setup | Technical setup questions |
| [`src/utils/README.md`](../src/utils/README.md) | Utility functions guide | When working with utils |

## 🎯 Current Project Phase

**Phase 1: Foundation Enhancement** (Active)
- Multi-service navigation system
- Performance services landing page
- Enhanced about page with credentials

**Milestone Progress**: Currently completing Issue #37 (1.3.1) - Adding Performance Credentials to About Page

### Milestone System
The project uses a 4-phase milestone system:
1. **Phase 1**: Foundation Enhancement
2. **Phase 2**: Service Integration  
3. **Phase 3**: Content Optimization
4. **Phase 4**: Experience Refinement

## 👨‍💻 First Steps for New Developers

### 1. **Get Oriented** (15 minutes)
- [ ] Complete the 5-minute quick start above
- [ ] Browse the live site: [www.rrishmusic.com](https://www.rrishmusic.com)
- [ ] Explore the local version at `http://localhost:5173`
- [ ] Look through the `src/components/pages/` folder to see main pages

### 2. **Understand the Workflow** (30 minutes)
- [ ] Read [`CLAUDE.md`](../CLAUDE.md) - especially the 11-step process
- [ ] Review current GitHub issues and milestones
- [ ] Understand the branch naming convention: `feature/issue-{number}-{description}`

### 3. **Make Your First Change** (45 minutes)
- [ ] Pick a small issue from the current milestone
- [ ] Create a feature branch following the naming convention
- [ ] Make the change following the quality gates
- [ ] Submit your first PR!

### 4. **Deep Dive** (As needed)
- [ ] Study the component architecture in `src/components/`
- [ ] Learn the content management system in `src/content/`
- [ ] Understand the multi-service approach (Performance/Teaching/Collaboration)

## 🆘 Getting Help

### Code Questions
- **Architecture Questions**: Review `src/components/` structure and existing patterns
- **Content Updates**: Check `src/content/` JSON files
- **Styling Questions**: We use Tailwind CSS with mobile-first approach

### Process Questions  
- **Development Workflow**: See [`CLAUDE.md`](../CLAUDE.md)
- **Git/GitHub Issues**: Follow the milestone system in GitHub
- **Quality Gates**: All code must pass linting, TypeScript checks, and builds

### Stuck on Something?
1. **Check existing code patterns** - Look for similar components/functionality
2. **Review the workflow** - Make sure you're following the 11-step process
3. **Check GitHub issues** - See if there's related discussion
4. **Create a GitHub issue** - Document your question for team discussion

## 💡 Key Development Principles

### Quality First
- **No direct pushes to main** - Always use feature branches
- **All quality gates must pass** - Linting, TypeScript, builds
- **Mobile-first responsive design** - Test on mobile devices
- **Accessibility compliance** - Follow WCAG guidelines

### Multi-Service Architecture
- **Protect existing functionality** - Especially teaching conversion paths
- **Service separation** - Clear boundaries between Performance/Teaching/Collaboration
- **Content-driven approach** - Use JSON files in `src/content/`

### Developer Experience
- **TypeScript everywhere** - Proper typing for all components
- **Component reusability** - Build modular, reusable components
- **Performance optimization** - Lazy loading, image optimization
- **Documentation** - Keep docs updated as you build

## 🎉 Welcome Aboard!

You're now ready to contribute to RrishMusic! Remember:

1. **Start small** - Pick up a simple issue from the current milestone
2. **Follow the process** - The 11-step workflow ensures quality
3. **Ask questions** - Better to ask than assume
4. **Have fun** - You're helping build something awesome for Rrish's music career!

---

**Next Steps**: Open [`CLAUDE.md`](../CLAUDE.md) to dive into the detailed development workflow.

Happy coding! 🎵