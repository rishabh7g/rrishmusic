# Common Technical Issues & Solutions

This document covers the most frequently encountered issues in the RrishMusic project and their step-by-step solutions.

## TypeScript Compilation Errors

### Issue: Module Resolution Failures

**Symptoms:**
```
Cannot find module '@/components/...' or its corresponding type declarations
Cannot resolve '@/types' import
```

**Root Cause:** Path alias configuration mismatch between `tsconfig.json` and `vite.config.ts`

**Solution:**
1. **Check `tsconfig.app.json` path mapping:**
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

2. **Verify `vite.config.ts` alias configuration:**
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
```

3. **Restart TypeScript server in VS Code:**
   - `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Issue: Interface and Type Import Errors

**Symptoms:**
```
'ServiceType' is not defined
Cannot import interface from '@/types/content'
```

**Solution:**
1. **Check export in source file (`src/types/content.ts`):**
```typescript
export interface ServiceType {
  // interface definition
}
```

2. **Use proper import syntax:**
```typescript
import type { ServiceType } from '@/types/content'
// OR for runtime usage:
import { ServiceType } from '@/types/content'
```

3. **Verify index file re-exports (`src/types/index.ts`):**
```typescript
export * from './content'
export * from './forms'
```

### Issue: Strict TypeScript Errors

**Symptoms:**
```
Object is possibly 'null' or 'undefined'
Property 'x' does not exist on type 'unknown'
```

**Solution:**
1. **Use optional chaining and nullish coalescing:**
```typescript
// Instead of:
const value = data.field.subfield

// Use:
const value = data?.field?.subfield ?? 'default'
```

2. **Type assertions with validation:**
```typescript
// Instead of:
const element = document.getElementById('id') as HTMLElement

// Use:
const element = document.getElementById('id')
if (!element) {
  console.error('Element not found')
  return
}
// Now element is properly typed
```

3. **Generic type constraints:**
```typescript
// Instead of:
function process<T>(item: T): T

// Use:
function process<T extends Record<string, unknown>>(item: T): T
```

## Build Failures

### Issue: Vite Build Memory Errors

**Symptoms:**
```
JavaScript heap out of memory
Build process killed
```

**Solution:**
1. **Increase Node.js memory limit:**
```bash
# In package.json scripts:
"build": "NODE_OPTIONS='--max-old-space-size=4096' tsc && vite build"
```

2. **Optimize bundle size - check for circular dependencies:**
```bash
npx madge --circular --extensions ts,tsx src/
```

3. **Enable build optimizations in `vite.config.ts`:**
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          motion: ['framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### Issue: CSS Import Errors During Build

**Symptoms:**
```
Failed to resolve import "./styles.css"
Unknown at rule @apply
```

**Solution:**
1. **Verify Tailwind CSS configuration in `postcss.config.js`:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

2. **Check Tailwind directives in main CSS file:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

3. **Ensure CSS files are properly imported:**
```typescript
// In main.tsx
import './index.css'
```

## Theme System Problems

### Issue: FOUC (Flash of Unstyled Content)

**Symptoms:**
- Brief flash of unstyled content on page load
- Theme switching causes visual flicker

**Solution:**
1. **Implement theme preloading script in `index.html`:**
```html
<script>
  // Prevent FOUC by applying theme before React loads
  (function() {
    const theme = localStorage.getItem('rrishmusic-theme') || 'system'
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const activeTheme = theme === 'system' ? systemTheme : theme
    document.documentElement.setAttribute('data-theme', activeTheme)
    document.documentElement.classList.add('theme-transition-disabled')
  })()
</script>
```

2. **Use CSS custom properties for instant theme application:**
```css
/* In index.css */
:root {
  --theme-transition: color 0.3s ease, background-color 0.3s ease;
}

.theme-transition-disabled * {
  transition: none !important;
}
```

3. **Enable transitions after initial load:**
```typescript
// In ThemeContext
useEffect(() => {
  // Re-enable transitions after initial load
  const timer = setTimeout(() => {
    document.documentElement.classList.remove('theme-transition-disabled')
  }, 100)
  return () => clearTimeout(timer)
}, [])
```

### Issue: Theme State Hydration Mismatch

**Symptoms:**
```
Warning: Prop `className` did not match. Server: "..." Client: "..."
```

**Solution:**
1. **Use client-side theme detection hook:**
```typescript
const useTheme = () => {
  const [theme, setTheme] = useState<ThemeMode>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as ThemeMode
    if (stored) setTheme(stored)
  }, [])

  if (!mounted) {
    return { theme: 'system', setTheme, mounted: false }
  }

  return { theme, setTheme, mounted: true }
}
```

2. **Conditional rendering for theme-dependent content:**
```typescript
const Component = () => {
  const { theme, mounted } = useTheme()
  
  if (!mounted) {
    return <div className="min-h-screen bg-neutral-100" />
  }
  
  return (
    <div className={cn('min-h-screen', themeClasses[theme])}>
      {/* Theme-dependent content */}
    </div>
  )
}
```

## Navigation Issues

### Issue: React Router Navigation Failures

**Symptoms:**
- Page not found errors for valid routes
- Navigation doesn't update URL
- Browser back button not working

**Solution:**
1. **Verify router configuration in `main.tsx`:**
```typescript
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

2. **Check route definitions in `App.tsx`:**
```typescript
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/performance" element={<Performance />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

3. **Fix navigation component implementation:**
```typescript
// In Navigation component
import { useNavigate, useLocation } from 'react-router-dom'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleNavigation = (path: string) => {
    try {
      navigate(path)
    } catch (error) {
      console.error('[Navigation] Error:', error)
      // Fallback to home
      navigate('/')
    }
  }
  
  return (
    <nav>
      {navItems.map(item => (
        <button 
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          className={cn(
            'nav-item',
            location.pathname === item.path && 'nav-item-active'
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}
```

### Issue: Mobile Navigation Menu Problems

**Symptoms:**
- Hamburger menu doesn't close after navigation
- Menu items not accessible on mobile
- Touch targets too small

**Solution:**
1. **Implement proper mobile menu state management:**
```typescript
const [isMenuOpen, setIsMenuOpen] = useState(false)

const handleMobileNavigation = (path: string) => {
  navigate(path)
  setIsMenuOpen(false) // Close menu after navigation
}

// Close menu on outside click
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsMenuOpen(false)
    }
  }

  if (isMenuOpen) {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }
}, [isMenuOpen])
```

2. **Ensure adequate touch targets (minimum 44px):**
```css
.mobile-nav-item {
  @apply min-h-[44px] min-w-[44px] flex items-center justify-center;
}
```

3. **Add proper ARIA attributes:**
```tsx
<button
  aria-expanded={isMenuOpen}
  aria-controls="mobile-menu"
  aria-label="Toggle navigation menu"
  onClick={() => setIsMenuOpen(!isMenuOpen)}
>
  <HamburgerIcon />
</button>

<nav 
  id="mobile-menu"
  aria-hidden={!isMenuOpen}
  className={cn(
    'mobile-menu',
    isMenuOpen ? 'block' : 'hidden'
  )}
>
  {/* Menu items */}
</nav>
```

## Form Validation Problems

### Issue: Validation Errors Not Displaying

**Symptoms:**
- Form submits with invalid data
- Error messages don't appear
- Validation runs but doesn't prevent submission

**Solution:**
1. **Check validation function implementation:**
```typescript
const validateField = (value: string, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = []
  
  for (const rule of rules) {
    const isValid = rule.validator(value, rule.options)
    if (!isValid) {
      errors.push(rule.message)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    value
  }
}
```

2. **Implement form state management correctly:**
```typescript
const [formData, setFormData] = useState(initialData)
const [errors, setErrors] = useState<Record<string, string[]>>({})
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  
  // Validate all fields
  const validationResults = validateForm(formData)
  setErrors(validationResults.errors)
  
  if (!validationResults.isValid) {
    setIsSubmitting(false)
    return
  }
  
  try {
    await submitForm(formData)
  } catch (error) {
    console.error('Submission error:', error)
  } finally {
    setIsSubmitting(false)
  }
}
```

3. **Display errors with proper accessibility:**
```tsx
<div className="form-field">
  <label htmlFor={fieldId} className="form-label">
    {label} {required && <span aria-label="required">*</span>}
  </label>
  <input
    id={fieldId}
    value={value}
    onChange={handleChange}
    aria-invalid={errors.length > 0}
    aria-describedby={errors.length > 0 ? `${fieldId}-error` : undefined}
    className={cn(
      'form-input',
      errors.length > 0 && 'form-input-error'
    )}
  />
  {errors.length > 0 && (
    <div id={`${fieldId}-error`} className="form-error" role="alert">
      {errors[0]}
    </div>
  )}
</div>
```

### Issue: Service-Specific Validation Not Working

**Solution:**
1. **Check service context detection:**
```typescript
const getServiceContext = (pathname: string): ServiceType => {
  if (pathname.includes('/performance')) return 'performance'
  if (pathname.includes('/collaboration')) return 'collaboration'
  return 'teaching' // default
}

const useServiceValidation = () => {
  const location = useLocation()
  const serviceType = getServiceContext(location.pathname)
  
  return useCallback((fieldName: string, value: string) => {
    const rules = getServiceValidationRules(serviceType, fieldName)
    return validateField(value, rules)
  }, [serviceType])
}
```

2. **Implement service-specific rules:**
```typescript
const SERVICE_VALIDATION_RULES: Record<ServiceType, Record<string, ValidationRule[]>> = {
  performance: {
    eventType: [
      { validator: required, message: 'Event type is required' },
      { validator: minLength, options: { min: 3 }, message: 'Event type too short' }
    ]
  },
  teaching: {
    experience: [
      { validator: required, message: 'Experience level is required' }
    ]
  }
}
```

## Quick Debugging Checklist

When encountering issues, check these in order:

1. **Clear development cache:**
```bash
rm -rf node_modules/.vite
npm run dev
```

2. **Verify environment:**
```bash
node -v  # Should be 16+ 
npm -v   # Should be 8+
```

3. **Check for TypeScript errors:**
```bash
npx tsc --noEmit
```

4. **Run linting:**
```bash
npx eslint src --ext .ts,.tsx
```

5. **Check console for runtime errors:**
   - Open browser DevTools
   - Look for red errors in Console tab
   - Check Network tab for failed requests

6. **Verify build process:**
```bash
npm run build
npm run preview
```

Remember: Most issues stem from TypeScript configuration, import/export mismatches, or missing error handling. Always check the browser console first for detailed error messages.