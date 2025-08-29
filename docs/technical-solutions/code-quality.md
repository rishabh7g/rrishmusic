# Code Quality Guidelines & Standards

This document defines code quality standards, ESLint configurations, TypeScript best practices, and code review guidelines for the RrishMusic project.

## ESLint Configuration & Rules

### Current Configuration Analysis

The project uses modern ESLint configuration with TypeScript support:

```typescript
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

### Enhanced ESLint Configuration

```typescript
// eslint.config.js - Enhanced version
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'

export default tseslint.config([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.configs.recommended,
      importPlugin.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      
      // React specific rules
      'react/prop-types': 'off', // Using TypeScript for prop validation
      'react/display-name': 'error',
      'react/no-array-index-key': 'warn',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-pascal-case': 'error',
      
      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Accessibility rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      
      // Import/Export rules
      'import/order': ['error', {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      'import/no-duplicates': 'error',
      'import/no-unused-modules': 'error',
      
      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      // Relax rules for test files
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
])
```

### Common ESLint Fixes

#### 1. TypeScript Errors

**Issue: `@typescript-eslint/no-explicit-any`**
```typescript
// ❌ Avoid
function processData(data: any): any {
  return data.map((item: any) => item.value)
}

// ✅ Better
interface DataItem {
  value: string
  id: number
}

function processData(data: DataItem[]): string[] {
  return data.map((item) => item.value)
}

// ✅ For truly unknown data
function processUnknownData(data: unknown): string[] {
  if (Array.isArray(data)) {
    return data
      .filter((item): item is DataItem => 
        typeof item === 'object' && 
        item !== null && 
        'value' in item
      )
      .map((item) => item.value)
  }
  return []
}
```

**Issue: `@typescript-eslint/no-unused-vars`**
```typescript
// ❌ Avoid
function handleSubmit(event: Event, data: FormData) {
  // 'data' parameter is unused
  event.preventDefault()
}

// ✅ Fix: Remove unused parameter
function handleSubmit(event: Event) {
  event.preventDefault()
}

// ✅ Or prefix with underscore if needed for interface compliance
function handleSubmit(event: Event, _data: FormData) {
  event.preventDefault()
}
```

**Issue: `@typescript-eslint/prefer-nullish-coalescing`**
```typescript
// ❌ Avoid
const value = config.setting || 'default'

// ✅ Better
const value = config.setting ?? 'default'

// ❌ Avoid
const isEnabled = config.enabled || false

// ✅ Better (when config.enabled could be false intentionally)
const isEnabled = config.enabled ?? false
```

#### 2. React Errors

**Issue: `react-hooks/exhaustive-deps`**
```typescript
// ❌ Missing dependency
useEffect(() => {
  fetchData(userId)
}, []) // userId is missing from deps

// ✅ Include all dependencies
useEffect(() => {
  fetchData(userId)
}, [userId])

// ✅ Or use callback pattern
const fetchUserData = useCallback(() => {
  fetchData(userId)
}, [userId])

useEffect(() => {
  fetchUserData()
}, [fetchUserData])
```

**Issue: `react/no-array-index-key`**
```typescript
// ❌ Avoid using array index as key
{items.map((item, index) => (
  <div key={index}>{item.name}</div>
))}

// ✅ Use unique, stable IDs
{items.map((item) => (
  <div key={item.id}>{item.name}</div>
))}

// ✅ If no ID available, create stable key
{items.map((item, index) => (
  <div key={`${item.name}-${index}`}>{item.name}</div>
))}
```

#### 3. Accessibility Errors

**Issue: `jsx-a11y/alt-text`**
```typescript
// ❌ Missing alt text
<img src="/performance.jpg" />

// ✅ Include descriptive alt text
<img src="/performance.jpg" alt="Rrish performing guitar at concert hall" />

// ✅ For decorative images
<img src="/decorative-border.jpg" alt="" role="presentation" />
```

**Issue: `jsx-a11y/click-events-have-key-events`**
```typescript
// ❌ Click handler without keyboard support
<div onClick={handleClick}>Click me</div>

// ✅ Add keyboard event handler
<div 
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabIndex={0}
>
  Click me
</div>

// ✅ Better: Use semantic button element
<button onClick={handleClick}>
  Click me
</button>
```

## TypeScript Best Practices

### Type Definitions

#### Interface vs Type Aliases

```typescript
// ✅ Prefer interfaces for object shapes
interface ServiceConfig {
  name: string
  type: ServiceType
  isActive: boolean
}

// ✅ Use type aliases for unions, primitives, computed types
type ServiceType = 'performance' | 'teaching' | 'collaboration'
type ServiceHandler = (config: ServiceConfig) => Promise<void>
type OptionalFields<T> = {
  [K in keyof T]?: T[K]
}
```

#### Generic Constraints

```typescript
// ❌ Overly broad generic
function process<T>(data: T): T {
  return data.map((item: any) => transform(item)) // Error: T might not have map
}

// ✅ Constrain generic appropriately
function process<T extends readonly unknown[]>(
  data: T
): { [K in keyof T]: TransformedItem } {
  return data.map((item) => transform(item)) as any
}

// ✅ Even better: Be specific about what you need
interface Processable {
  map<U>(fn: (item: unknown) => U): U[]
}

function process<T extends Processable>(data: T): TransformedItem[] {
  return data.map((item) => transform(item))
}
```

#### Utility Types Usage

```typescript
// ✅ Use built-in utility types effectively
interface FormData {
  name: string
  email: string
  phone?: string
  message: string
}

// Create variants using utility types
type RequiredFormData = Required<FormData>
type FormDataKeys = keyof FormData
type ContactInfo = Pick<FormData, 'name' | 'email' | 'phone'>
type MessageOnly = Omit<FormData, 'name' | 'email' | 'phone'>

// ✅ Custom utility types for domain-specific needs
type ServiceFormData<T extends ServiceType> = FormData & {
  serviceType: T
  additionalFields: ServiceSpecificFields<T>
}
```

### Error Handling Patterns

```typescript
// ✅ Result pattern for error handling
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E }

async function fetchUserData(id: string): Promise<Result<UserData>> {
  try {
    const response = await api.get(`/users/${id}`)
    return { success: true, data: response.data }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error : new Error('Unknown error')
    }
  }
}

// Usage
const result = await fetchUserData('123')
if (result.success) {
  console.log(result.data.name) // TypeScript knows this is UserData
} else {
  console.error(result.error.message) // TypeScript knows this is Error
}
```

### Component Typing Patterns

```typescript
// ✅ Comprehensive component typing
interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
  children,
  'data-testid': testId,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        { 'btn-loading': loading },
        className
      )}
      data-testid={testId}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

// ✅ Forward ref with proper typing
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string
    error?: string
    helpText?: string
  }
>(({ label, error, helpText, className, ...props }, ref) => {
  const inputId = React.useId()
  
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn('input', { 'input-error': error }, className)}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <div id={`${inputId}-error`} className="input-error-text" role="alert">
          {error}
        </div>
      )}
      {helpText && !error && (
        <div className="input-help-text">{helpText}</div>
      )}
    </div>
  )
})

Input.displayName = 'Input'
```

## Code Review Guidelines

### Review Checklist

#### Functionality Review
- [ ] Code solves the intended problem
- [ ] Edge cases are handled appropriately
- [ ] Error states are properly managed
- [ ] No obvious bugs or logical errors
- [ ] Performance considerations are addressed

#### Code Quality Review
- [ ] Code follows established patterns and conventions
- [ ] Functions are small and focused (< 50 lines ideally)
- [ ] Naming is clear and descriptive
- [ ] Comments explain "why", not "what"
- [ ] No code duplication without justification

#### TypeScript Review
- [ ] All types are properly defined
- [ ] No `any` types without justification
- [ ] Generics are used appropriately
- [ ] Type assertions are safe and necessary
- [ ] Interface/type naming follows conventions

#### React Review
- [ ] Components are properly composed
- [ ] Hooks are used correctly
- [ ] Props are typed appropriately
- [ ] Component responsibilities are clear
- [ ] Re-renders are optimized where necessary

#### Testing Review
- [ ] New functionality has appropriate test coverage
- [ ] Tests are clear and maintainable
- [ ] Test names describe behavior, not implementation
- [ ] Edge cases are tested
- [ ] Accessibility is tested where relevant

#### Security Review
- [ ] No sensitive data exposed
- [ ] Input validation is present
- [ ] XSS vulnerabilities are prevented
- [ ] Dependencies are secure and up-to-date

### Review Process

1. **Automated Checks First**
   ```bash
   # Run all quality gates before review
   npm run lint
   npx tsc --noEmit
   npm run test
   npm run build
   ```

2. **Self-Review Checklist**
   - Read through your own code as if reviewing someone else's
   - Check for hardcoded values that should be constants
   - Ensure error handling is comprehensive
   - Verify accessibility attributes are present

3. **PR Description Template**
   ```markdown
   ## Changes Made
   - Brief description of changes
   - Link to related issue: Closes #123
   
   ## Testing Done
   - [ ] Manual testing on desktop
   - [ ] Manual testing on mobile
   - [ ] Automated tests added/updated
   - [ ] Accessibility testing completed
   
   ## Code Quality
   - [ ] ESLint passes
   - [ ] TypeScript compiles without errors
   - [ ] No console.log statements in production code
   - [ ] Performance impact considered
   
   ## Deployment Notes
   - Any special deployment considerations
   - Database migrations needed
   - Environment variable changes
   ```

## Refactoring Patterns

### Component Refactoring

```typescript
// ❌ Before: Large, complex component
const ContactForm = () => {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ... 100+ lines of validation logic
  // ... 50+ lines of submission logic
  // ... 200+ lines of JSX
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Massive form JSX */}
    </form>
  )
}

// ✅ After: Extracted hooks and components
const ContactForm = ({ serviceType }: ContactFormProps) => {
  const formState = useContactForm(serviceType)
  const validation = useFormValidation(serviceType)
  const submission = useFormSubmission()

  return (
    <form onSubmit={submission.handleSubmit}>
      <ContactFormFields 
        formState={formState}
        validation={validation}
        serviceType={serviceType}
      />
      <ContactFormActions
        isSubmitting={submission.isSubmitting}
        canSubmit={validation.isValid}
      />
    </form>
  )
}

// Extracted custom hooks
const useContactForm = (serviceType: ServiceType) => {
  const [formData, setFormData] = useState(() => 
    getInitialFormData(serviceType)
  )
  
  const updateField = useCallback((field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  return { formData, updateField }
}
```

### Utility Function Refactoring

```typescript
// ❌ Before: God function
function processContactSubmission(data: any, serviceType: string, userContext: any) {
  // 50+ lines of validation
  // 30+ lines of data transformation
  // 25+ lines of API calling
  // 20+ lines of error handling
  // 15+ lines of success handling
}

// ✅ After: Composed functions
const processContactSubmission = async (
  data: ContactFormData,
  serviceType: ServiceType,
  userContext: UserContext
): Promise<SubmissionResult> => {
  const validation = await validateContactData(data, serviceType)
  if (!validation.isValid) {
    return { success: false, errors: validation.errors }
  }

  const transformedData = transformFormData(data, serviceType, userContext)
  
  try {
    const response = await submitContactForm(transformedData)
    return handleSubmissionSuccess(response, serviceType)
  } catch (error) {
    return handleSubmissionError(error, serviceType)
  }
}

// Each function has a single responsibility
const validateContactData = async (
  data: ContactFormData, 
  serviceType: ServiceType
): Promise<ValidationResult> => {
  // Focus only on validation logic
}

const transformFormData = (
  data: ContactFormData,
  serviceType: ServiceType,
  userContext: UserContext
): ApiContactData => {
  // Focus only on data transformation
}
```

## Performance Considerations

### Bundle Size Optimization

```typescript
// ❌ Importing entire libraries
import * as _ from 'lodash'
import { format, parseISO, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns'

// ✅ Import only what you need
import { debounce } from 'lodash-es/debounce'
import { format } from 'date-fns/format'

// ✅ Create lightweight alternatives
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
```

### Memory Management

```typescript
// ✅ Proper cleanup in components
const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(collectMetrics())
    }, 1000)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(interval)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return <MetricsDisplay metrics={metrics} />
}
```

Remember: Code quality is not just about following rules—it's about creating maintainable, readable, and reliable software that serves users effectively. Focus on clarity, consistency, and correctness.