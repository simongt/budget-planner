# Coding Standards

## Executive Summary

This document establishes comprehensive coding standards for the Budget Planner application, ensuring consistency, maintainability, and code quality across the modernized codebase.

## 🎯 Coding Standards Goals

### Primary Objectives
1. **Type Safety** - Full TypeScript implementation with strict mode
2. **Code Consistency** - Consistent formatting and naming conventions
3. **Code Quality** - ESLint rules and best practices
4. **Maintainability** - Clear structure and documentation
5. **Performance** - Performance-aware coding patterns

## 📝 TypeScript Standards

### Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES6"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/hooks/*": ["hooks/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "build", "dist"]
}
```

### Type Definitions
```typescript
// types/index.ts
// Core application types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface BudgetData {
  id: string;
  label: string;
  amount: number;
  percentage?: number;
  category?: string;
}

export interface BudgetState {
  annualSalary: number;
  expensePercentage: number;
  monthlyExpenses: number;
  monthlySavings: number;
  budgetData: BudgetData[];
  currency: Currency;
  isFormSubmitted: boolean;
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Component prop types
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: string | number;
  message: string;
}
```

### Type Safety Best Practices
```typescript
// ✅ Good - Proper type definitions
interface BudgetCalculatorProps {
  initialSalary: number;
  initialPercentage: number;
  onValuesChange: (values: Partial<BudgetState>) => void;
  disabled?: boolean;
}

const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  initialSalary,
  initialPercentage,
  onValuesChange,
  disabled = false
}) => {
  // Component implementation
};

// ❌ Bad - Missing type definitions
const BudgetCalculator = ({ initialSalary, onValuesChange }) => {
  // Component implementation
};

// ✅ Good - Generic types
interface ApiHookResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const useApiData = <T>(url: string): ApiHookResult<T> => {
  // Hook implementation
};

// ✅ Good - Union types
type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant: ButtonVariant;
  size: ButtonSize;
  children: React.ReactNode;
}
```

## 🔧 ESLint Configuration

### ESLint Rules
```json
// .eslintrc.json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "@typescript-eslint",
    "react-hooks",
    "prefer-arrow"
  ],
  "rules": {
    // TypeScript rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-var-requires": "error",
    
    // React rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    
    // General rules
    "prefer-const": "error",
    "no-var": "error",
    "no-console": "warn",
    "no-debugger": "error",
    "prefer-arrow/prefer-arrow-functions": "error",
    
    // Import rules
    "import/order": [
      "error",
      {
        "groups": [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "newlines-between": "always"
      }
    ]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## 📁 File Structure Standards

### Directory Structure
```
src/
├── app/                    # Application core
│   ├── store/             # Redux store
│   ├── hooks/             # Custom hooks
│   └── providers/         # Context providers
├── features/              # Feature-based modules
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Feature components
│   │   ├── hooks/         # Feature hooks
│   │   ├── services/      # Feature services
│   │   └── types.ts       # Feature types
│   └── budget/            # Budget feature
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types.ts
├── shared/                # Shared resources
│   ├── components/        # Reusable components
│   ├── utils/             # Utility functions
│   ├── constants/         # Application constants
│   └── types/             # Shared types
└── styles/                # Global styles
    ├── theme.ts
    └── globalStyles.ts
```

### File Naming Conventions
```typescript
// ✅ Good - Descriptive file names
BudgetCalculator.tsx
useBudgetCalculation.ts
budgetService.ts
BudgetTypes.ts

// ❌ Bad - Unclear file names
calc.ts
hook.ts
service.ts
types.ts

// ✅ Good - Component files
BudgetCalculator.tsx
BudgetCalculator.test.tsx
BudgetCalculator.stories.tsx

// ✅ Good - Hook files
useBudgetCalculation.ts
useBudgetCalculation.test.ts

// ✅ Good - Service files
budgetService.ts
authService.ts
apiService.ts
```

## 🧩 Component Standards

### Component Structure
```typescript
// ✅ Good - Well-structured component
import React, { useState, useCallback, useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { Button, TextField } from '@mui/material';

// Types
interface BudgetCalculatorProps {
  initialSalary: number;
  initialPercentage: number;
  onValuesChange: (values: Partial<BudgetState>) => void;
  disabled?: boolean;
}

// Styled components
const CalculatorContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius
}));

// Component
const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  initialSalary,
  initialPercentage,
  onValuesChange,
  disabled = false
}) => {
  // State
  const [salary, setSalary] = useState(initialSalary);
  const [percentage, setPercentage] = useState(initialPercentage);

  // Memoized values
  const monthlyExpenses = useMemo(() => 
    (salary / 12) * (percentage / 100), 
    [salary, percentage]
  );

  const monthlySavings = useMemo(() => 
    (salary / 12) * ((100 - percentage) / 100), 
    [salary, percentage]
  );

  // Event handlers
  const handleSalaryChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const newSalary = parseFloat(event.target.value);
    setSalary(newSalary);
    onValuesChange({ annualSalary: newSalary });
  }, [onValuesChange]);

  const handlePercentageChange = useCallback((event: Event, newValue: number) => {
    setPercentage(newValue);
    onValuesChange({ expensePercentage: newValue });
  }, [onValuesChange]);

  // Render
  return (
    <CalculatorContainer>
      <TextField
        label="Annual Salary"
        type="number"
        value={salary}
        onChange={handleSalaryChange}
        disabled={disabled}
      />
      {/* More JSX */}
    </CalculatorContainer>
  );
};

// PropTypes (for documentation)
BudgetCalculator.displayName = 'BudgetCalculator';

export default BudgetCalculator;
```

### Component Best Practices
```typescript
// ✅ Good - Functional components with hooks
const BudgetDisplay: React.FC<BudgetDisplayProps> = ({ data }) => {
  // Component logic
};

// ❌ Bad - Class components (avoid in new code)
class BudgetDisplay extends Component {
  // Component logic
}

// ✅ Good - Proper prop destructuring
const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  children, 
  ...props 
}) => {
  // Component logic
};

// ❌ Bad - Inline styles
const Component = () => (
  <div style={{ margin: '10px', padding: '20px' }}>
    Content
  </div>
);

// ✅ Good - Styled components
const StyledContainer = styled('div')(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(2.5)
}));

const Component = () => (
  <StyledContainer>
    Content
  </StyledContainer>
);
```

## 🪝 Hook Standards

### Custom Hook Structure
```typescript
// ✅ Good - Well-structured custom hook
import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseBudgetCalculationProps {
  initialSalary: number;
  initialPercentage: number;
}

interface UseBudgetCalculationReturn {
  salary: number;
  percentage: number;
  monthlyExpenses: number;
  monthlySavings: number;
  setSalary: (salary: number) => void;
  setPercentage: (percentage: number) => void;
  reset: () => void;
}

export const useBudgetCalculation = ({
  initialSalary,
  initialPercentage
}: UseBudgetCalculationProps): UseBudgetCalculationReturn => {
  // State
  const [salary, setSalary] = useState(initialSalary);
  const [percentage, setPercentage] = useState(initialPercentage);

  // Memoized calculations
  const monthlyExpenses = useMemo(() => 
    (salary / 12) * (percentage / 100), 
    [salary, percentage]
  );

  const monthlySavings = useMemo(() => 
    (salary / 12) * ((100 - percentage) / 100), 
    [salary, percentage]
  );

  // Actions
  const reset = useCallback(() => {
    setSalary(initialSalary);
    setPercentage(initialPercentage);
  }, [initialSalary, initialPercentage]);

  // Effects
  useEffect(() => {
    // Side effects if needed
  }, [salary, percentage]);

  return {
    salary,
    percentage,
    monthlyExpenses,
    monthlySavings,
    setSalary,
    setPercentage,
    reset
  };
};
```

### Hook Best Practices
```typescript
// ✅ Good - Proper hook naming
const useBudgetCalculation = () => { /* ... */ };
const useAuth = () => { /* ... */ };
const useLocalStorage = () => { /* ... */ };

// ❌ Bad - Generic hook names
const useData = () => { /* ... */ };
const useState = () => { /* ... */ };

// ✅ Good - Proper dependency arrays
useEffect(() => {
  // Effect logic
}, [dependency1, dependency2]);

// ❌ Bad - Missing dependencies
useEffect(() => {
  // Effect logic
}, []); // Missing dependencies

// ✅ Good - Memoized callbacks
const handleClick = useCallback(() => {
  // Click handler
}, [dependency]);

// ❌ Bad - New function on every render
const handleClick = () => {
  // Click handler
};
```

## 🧪 Testing Standards

### Test File Structure
```typescript
// BudgetCalculator.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BudgetCalculator from './BudgetCalculator';

describe('BudgetCalculator', () => {
  const defaultProps = {
    initialSalary: 75000,
    initialPercentage: 15,
    onValuesChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial values', () => {
    render(<BudgetCalculator {...defaultProps} />);
    
    expect(screen.getByLabelText(/annual salary/i)).toHaveValue(75000);
    expect(screen.getByText(/15%/)).toBeInTheDocument();
  });

  it('calls onValuesChange when salary changes', async () => {
    const user = userEvent.setup();
    render(<BudgetCalculator {...defaultProps} />);
    
    const salaryInput = screen.getByLabelText(/annual salary/i);
    await user.clear(salaryInput);
    await user.type(salaryInput, '80000');
    
    expect(defaultProps.onValuesChange).toHaveBeenCalledWith({
      annualSalary: 80000
    });
  });

  it('calculates monthly expenses correctly', () => {
    render(<BudgetCalculator {...defaultProps} />);
    
    expect(screen.getByText(/\$937\.50/)).toBeInTheDocument();
  });

  it('disables inputs when disabled prop is true', () => {
    render(<BudgetCalculator {...defaultProps} disabled />);
    
    expect(screen.getByLabelText(/annual salary/i)).toBeDisabled();
  });
});
```

### Testing Best Practices
```typescript
// ✅ Good - Descriptive test names
it('should calculate monthly expenses when salary and percentage change', () => {
  // Test implementation
});

// ❌ Bad - Unclear test names
it('should work', () => {
  // Test implementation
});

// ✅ Good - Proper test setup
describe('BudgetCalculator', () => {
  const mockOnValuesChange = jest.fn();
  
  beforeEach(() => {
    mockOnValuesChange.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

// ✅ Good - Testing user interactions
it('should update salary when user types in input', async () => {
  const user = userEvent.setup();
  render(<BudgetCalculator />);
  
  const input = screen.getByLabelText(/salary/i);
  await user.type(input, '80000');
  
  expect(input).toHaveValue(80000);
});

// ✅ Good - Testing edge cases
it('should handle invalid input gracefully', () => {
  render(<BudgetCalculator />);
  
  const input = screen.getByLabelText(/salary/i);
  fireEvent.change(input, { target: { value: 'invalid' } });
  
  expect(input).toHaveValue('invalid');
  expect(screen.getByText(/please enter a valid number/i)).toBeInTheDocument();
});
```

## 📚 Documentation Standards

### JSDoc Comments
```typescript
/**
 * Calculates monthly budget breakdown based on annual salary and expense percentage
 * @param annualSalary - The annual salary amount
 * @param expensePercentage - The percentage allocated to expenses (1-30)
 * @returns Object containing monthly expenses and savings
 * @example
 * ```typescript
 * const budget = calculateMonthlyBudget(75000, 15);
 * console.log(budget.monthlyExpenses); // 937.5
 * console.log(budget.monthlySavings); // 5312.5
 * ```
 */
export const calculateMonthlyBudget = (
  annualSalary: number,
  expensePercentage: number
): { monthlyExpenses: number; monthlySavings: number } => {
  const monthlyExpenses = (annualSalary / 12) * (expensePercentage / 100);
  const monthlySavings = (annualSalary / 12) * ((100 - expensePercentage) / 100);
  
  return { monthlyExpenses, monthlySavings };
};

/**
 * Custom hook for managing budget calculations
 * @param initialSalary - Initial annual salary value
 * @param initialPercentage - Initial expense percentage value
 * @returns Budget calculation state and actions
 */
export const useBudgetCalculation = (
  initialSalary: number,
  initialPercentage: number
) => {
  // Hook implementation
};
```

### README Documentation
```markdown
# Budget Calculator Component

A React component for calculating monthly budget breakdown based on annual salary and expense allocation.

## Features

- Real-time budget calculations
- Responsive design
- Accessibility compliant
- TypeScript support

## Usage

```tsx
import { BudgetCalculator } from './BudgetCalculator';

function App() {
  const handleValuesChange = (values) => {
    console.log('Budget values changed:', values);
  };

  return (
    <BudgetCalculator
      initialSalary={75000}
      initialPercentage={15}
      onValuesChange={handleValuesChange}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| initialSalary | number | 75000 | Initial annual salary |
| initialPercentage | number | 15 | Initial expense percentage |
| onValuesChange | function | - | Callback when values change |
| disabled | boolean | false | Disable all inputs |

## Examples

See [examples](./examples) directory for more usage examples.
```

## 🚀 Performance Standards

### Performance Best Practices
```typescript
// ✅ Good - Memoized components
const BudgetDisplay = React.memo<BudgetDisplayProps>(({ data }) => {
  // Component logic
});

// ✅ Good - Memoized calculations
const expensiveValue = useMemo(() => {
  return performExpensiveCalculation(data);
}, [data]);

// ✅ Good - Memoized callbacks
const handleClick = useCallback(() => {
  // Click handler
}, [dependency]);

// ❌ Bad - Expensive operations in render
const Component = ({ data }) => {
  const expensiveValue = performExpensiveCalculation(data); // Runs on every render
  return <div>{expensiveValue}</div>;
};

// ❌ Bad - New functions on every render
const Component = ({ onAction }) => {
  const handleClick = () => onAction(); // New function every render
  return <button onClick={handleClick}>Click</button>;
};
```

### Bundle Size Standards
```typescript
// ✅ Good - Tree-shakeable imports
import { Button } from '@mui/material/Button';
import { TextField } from '@mui/material/TextField';

// ❌ Bad - Non-tree-shakeable imports
import { Button, TextField } from '@mui/material';

// ✅ Good - Dynamic imports for large components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ Good - Conditional imports
const ChartComponent = process.env.NODE_ENV === 'development' 
  ? require('./DevChart').default 
  : require('./ProdChart').default;
```

## 🔒 Security Standards

### Security Best Practices
```typescript
// ✅ Good - Input validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Good - Sanitized inputs
const sanitizeInput = (input: string): string => {
  return input.replace(/[<>]/g, '');
};

// ❌ Bad - Direct DOM manipulation
const Component = () => {
  useEffect(() => {
    document.getElementById('element').innerHTML = userInput; // XSS risk
  }, []);
};

// ✅ Good - Safe DOM manipulation
const Component = () => {
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.textContent = sanitizeInput(userInput);
    }
  }, [userInput]);
};
```

## 📋 Code Review Checklist

### Before Submitting Code
- [ ] TypeScript compilation passes
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] All tests pass
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] Performance impact considered
- [ ] Accessibility requirements met
- [ ] Security considerations addressed
- [ ] Code follows established patterns

### Review Criteria
- [ ] Code is readable and well-structured
- [ ] Types are properly defined
- [ ] Components are properly memoized
- [ ] Hooks follow best practices
- [ ] Error handling is implemented
- [ ] Performance optimizations applied
- [ ] Tests cover edge cases
- [ ] Documentation is clear and complete

This coding standards document ensures consistent, maintainable, and high-quality code across the Budget Planner application.
