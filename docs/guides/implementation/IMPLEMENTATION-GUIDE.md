# RrishMusic React Implementation Guide

**Version:** 1.0  
**Date:** August 2025  
**Tech Stack:** React + TypeScript + Vite + Tailwind CSS + Framer Motion + GitHub Pages

## 📋 Implementation Checklist

- [ ] **Task 1:** Project Setup & Foundation
- [ ] **Task 2:** Development Tools Configuration  
- [ ] **Task 3:** Testing Framework Setup
- [ ] **Task 4:** GitHub Actions & CI/CD
- [ ] **Task 5:** Project Structure & Types
- [ ] **Task 6:** Layout Components
- [ ] **Task 7:** UI Components
- [ ] **Task 8:** Section Components
- [ ] **Task 9:** Third-party Integrations
- [ ] **Task 10:** Performance & Deployment

---

## 🚀 **Task 1: Project Setup & Foundation**

### **Objective:** Initialize React + TypeScript + Vite project

#### **Step 1.1: Project Initialization**
```bash
# Navigate to project directory
cd /Users/rrish/Documents/code/rrishmusic

# Remove existing files (switching from vanilla to React)
rm -rf styles/ scripts/ index.html

# Initialize Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Answer "y" when prompted about existing files
```

#### **Step 1.2: Install Dependencies**
```bash
# Install base dependencies
npm install

# Install styling and animation
npm install tailwindcss postcss autoprefixer framer-motion
npm install -D @tailwindcss/typography

# Install development tools
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
npm install -D @types/react @types/react-dom

# Install testing framework
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom

# Install React Router
npm install react-router-dom
npm install -D @types/react-router-dom
```

#### **Step 1.3: Update package.json**
Add/update these properties in `package.json`:

```json
{
  "name": "rrishmusic",
  "homepage": "https://rishabh7g.github.io/rrishmusic",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview", 
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext ts,tsx",
    "lint:fix": "eslint src --ext ts,tsx --fix",
    "format": "prettier --write src/"
  }
}
```

#### **Step 1.4: Verification**
- [ ] Run `npm run dev` - should start development server at `http://localhost:5173`
- [ ] Verify React + TypeScript template loads correctly
- [ ] Check that all dependencies installed without errors

**Status:** ✅ COMPLETED

---

## ⚙️ **Task 2: Development Tools Configuration**

### **Objective:** Set up Tailwind CSS, ESLint, Prettier, and TypeScript config

#### **Step 2.1: Initialize Tailwind CSS**
```bash
# Initialize Tailwind configuration
npx tailwindcss init -p
```

#### **Step 2.2: Configure Tailwind CSS**
Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          'blue-primary': '#1e40af',
          'blue-secondary': '#3b82f6', 
          'orange-warm': '#ea580c',
          'yellow-accent': '#fbbf24'
        },
        neutral: {
          'charcoal': '#374151',
          'gray-light': '#f8fafc'
        }
      },
      fontFamily: {
        'heading': ['Montserrat', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
        'accent': ['Dancing Script', 'cursive']
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '3rem',
          xl: '4rem'
        },
        screens: {
          sm: '640px',
          md: '768px', 
          lg: '1024px',
          xl: '1200px'
        }
      }
    }
  },
  plugins: []
}
```

#### **Step 2.3: Update Global CSS**
Replace `src/index.css` content:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&family=Dancing+Script:wght@400&display=swap');

/* Custom CSS Variables */
:root {
  --scroll-offset: 80px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Base styles */
body {
  font-family: 'Open Sans', sans-serif;
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Montserrat', sans-serif;
}

/* Custom utility classes */
@layer components {
  .section {
    @apply min-h-screen flex items-center justify-center py-16 px-4;
  }
  
  .container-custom {
    @apply container mx-auto px-4 sm:px-6 lg:px-8;
  }
}
```

#### **Step 2.4: Configure ESLint**
Create `.eslintrc.json`:

```json
{
  "root": true,
  "env": { "browser": true, "es2020": true },
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "ignorePatterns": ["dist", ".eslintrc.cjs"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "rules": {
    "react-refresh/only-export-components": [
      "warn",
      { "allowConstantExport": true }
    ],
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  }
}
```

#### **Step 2.5: Configure Prettier**
Create `prettier.config.js`:

```javascript
/** @type {import("prettier").Config} */
export default {
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf'
}
```

#### **Step 2.6: Update Vite Configuration**
Update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rrishmusic/', // Repository name for GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable for production
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  }
})
```

#### **Step 2.7: Update TypeScript Configuration**
Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/components/*": ["src/components/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### **Step 2.8: Verification**
- [ ] Run `npm run dev` - no errors
- [ ] Run `npm run lint` - should pass
- [ ] Run `npm run type-check` - should pass
- [ ] Verify Tailwind classes work in components

**Status:** ⏳ PENDING

---

## 🧪 **Task 3: Testing Framework Setup**

### **Objective:** Configure Vitest with React Testing Library

#### **Step 3.1: Create Test Setup File**
Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

#### **Step 3.2: Update Vite Config for Testing**
Already done in Step 2.6 - verify test configuration exists in `vite.config.ts`

#### **Step 3.3: Create Example Test**
Create `src/App.test.tsx`:

```typescript
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByText(/vite \+ react/i)).toBeInTheDocument()
  })
})
```

#### **Step 3.4: Verification**
- [ ] Run `npm test` - should run tests
- [ ] Run `npm run test:coverage` - should generate coverage report
- [ ] Example test should pass

**Status:** ⏳ PENDING

---

## 🔄 **Task 4: GitHub Actions & CI/CD**

### **Objective:** Set up automated testing and deployment

#### **Step 4.1: Create GitHub Actions Workflow**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy RrishMusic to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write
  pull-requests: write
  checks: write

jobs:
  test:
    runs-on: ubuntu-latest
    name: Test Suite
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run type checking
        run: npm run type-check
        
      - name: Run linting
        run: npm run lint
        
      - name: Run unit tests
        run: npm run test -- --watchAll=false
        
      - name: Build project
        run: npm run build
        
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: test-results
          path: coverage/

  deploy:
    needs: test
    runs-on: ubuntu-latest
    name: Deploy to GitHub Pages
    if: github.ref == 'refs/heads/main'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build for production
        run: npm run build
        env:
          GENERATE_SOURCEMAP: false
          
      - name: Upload build artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
          
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### **Step 4.2: Configure GitHub Pages**
- [ ] Go to repository Settings → Pages
- [ ] Select "GitHub Actions" as source
- [ ] Configure custom domain: `www.rrishmusic.com`

#### **Step 4.3: Create Custom Domain File**
Create `public/CNAME`:
```
www.rrishmusic.com
```

#### **Step 4.4: Set up Branch Protection**
- [ ] Go to Settings → Branches
- [ ] Add rule for `main` branch
- [ ] Require status checks: `Test Suite`
- [ ] Require pull request reviews

**Status:** ⏳ PENDING

---

## 📁 **Task 5: Project Structure & Types**

### **Objective:** Create organized folder structure and TypeScript types

#### **Step 5.1: Create Folder Structure**
```bash
mkdir -p src/{components/{layout,sections,ui},hooks,utils,types,styles}
mkdir -p src/test
mkdir -p public/images
```

#### **Step 5.2: Create TypeScript Types**
Create `src/types/index.ts`:

```typescript
export interface SectionProps {
  id: string
  className?: string
}

export interface NavigationItem {
  id: string
  label: string
  href: string
}

export interface LessonPackage {
  id: string
  name: string
  sessions: number
  price: number
  discount?: number
  features: string[]
}

export interface ContactFormData {
  name: string
  email: string
  message: string
  lessonType: 'individual' | 'consultation'
}

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline'
  size: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  className?: string
}

export interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'textarea'
  required?: boolean
  placeholder?: string
  error?: string
}
```

#### **Step 5.3: Create Utility Constants**
Create `src/utils/constants.ts`:

```typescript
export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'approach', label: 'Approach', href: '#approach' },
  { id: 'lessons', label: 'Lessons', href: '#lessons' },
  { id: 'community', label: 'Community', href: '#community' },
  { id: 'contact', label: 'Contact', href: '#contact' }
]

export const LESSON_PACKAGES: LessonPackage[] = [
  {
    id: 'single',
    name: 'Single Lesson',
    sessions: 1,
    price: 50,
    features: ['1-hour individual lesson', 'Personalized feedback', 'Practice materials']
  },
  {
    id: 'package-4',
    name: '4-Lesson Package',
    sessions: 4,
    price: 190,
    discount: 5,
    features: ['4 individual lessons', 'Progress tracking', 'Custom practice plan', '5% savings']
  },
  {
    id: 'package-8',
    name: '8-Lesson Package', 
    sessions: 8,
    price: 360,
    discount: 10,
    features: ['8 individual lessons', 'Structured curriculum', 'Performance goals', '10% savings']
  }
]
```

**Status:** ⏳ PENDING

---

## 🏗️ **Task 6-10: Component Development**

### **Coming Next:**
- Task 6: Layout Components (Navigation, Header, Footer)
- Task 7: UI Components (Button, Card, Form)
- Task 8: Section Components (Hero, About, Lessons, etc.)
- Task 9: Third-party Integrations (Calendly, Stripe, Instagram)
- Task 10: Performance Optimization & Deployment

---

## 📝 **Progress Tracking**

**Current Status:** Task 1 ✅ COMPLETED  
**Next Up:** Task 2 - Development Tools Configuration  
**Timeline:** ~2 weeks for full implementation  

**Notes:**
- Document any issues or deviations from the plan
- Update checklist as tasks are completed
- Add screenshots or examples for complex implementations

---

*Last Updated: August 2025*  
*Implementation Guide Version: 1.0*