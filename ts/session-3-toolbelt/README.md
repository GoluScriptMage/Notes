# Session 3: The Toolbelt

**Utility Types for System Architecture**

## 🎯 Learning Objectives

- Master **Utility Types** (`Partial`, `Pick`, `Omit`, `Record`) in complex scenarios
- Build **form systems** that derive types from entity models
- Create **type transformations** that scale across large codebases
- Implement **advanced mapped types** for real-world architecture

---

## 🔥 The Challenge: Enterprise Form System

You're architecting a form system for a massive enterprise application with hundreds of different entity types. The system needs to automatically generate form types, validation schemas, and update mechanisms from existing entity definitions - all while maintaining perfect type safety.

**The Problem**: The current system uses `any` everywhere and constantly breaks when entity definitions change. Your mission is to build a type-safe form system that automatically adapts to entity changes and prevents runtime errors.

### Files to Work With:

1. **`challenge.ts`** - The broken form system you need to fix
2. **`entities.ts`** - Complex entity definitions to work with
3. **`form-types.ts`** - Utility types you need to implement
4. **`examples.ts`** - Real-world form usage scenarios
5. **`advanced.ts`** - Master-level type transformations

---

## 📋 Rules for This Challenge

1. **NO manual type duplication** - Everything must derive from entities
2. **Type-safe field access** - Wrong field names = compile errors
3. **Automatic adaptation** - Adding entity fields updates form types automatically
4. **Nested object support** - Handle complex nested structures
5. **Validation integration** - Form types must work with validation libraries

---

## 🎖️ Success Criteria

- [ ] Form types automatically derive from entity definitions
- [ ] Field validation is type-safe and comprehensive
- [ ] Adding new entity properties updates all related types
- [ ] Nested object forms work seamlessly
- [ ] IntelliSense provides accurate field suggestions
- [ ] Wrong field access shows compile-time errors

---

## 💡 Key Concepts You'll Master

### Utility Type Composition

```typescript
// Combine utility types for powerful transformations
type FormData<T> = Partial<Pick<T, FormFields<T>>> &
  Required<Pick<T, RequiredFields<T>>>;

// Chain transformations for complex business logic
type UserFormUpdate = Omit<Partial<User>, "id" | "createdAt"> & {
  passwordConfirmation?: string;
};
```

### Advanced Mapped Types

```typescript
// Transform object types systematically
type FormFields<T> = {
  [K in keyof T]: {
    value: T[K];
    error: string | null;
    touched: boolean;
    dirty: boolean;
  };
};

// Conditional property transformation
type OptionalExcept<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
```

### Template Literal Types

```typescript
// Generate dynamic property names
type ValidationErrors<T> = {
  [K in keyof T as `${string & K}Error`]: string | null;
};

// Create event handler names
type FormHandlers<T> = {
  [K in keyof T as `handle${Capitalize<string & K>}Change`]: (
    value: T[K]
  ) => void;
};
```

### Deep Object Manipulation

```typescript
// Recursively transform nested objects
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

// Extract nested property types
type NestedPaths<T> = {
  [K in keyof T]: T[K] extends object
    ? `${string & K}.${string & NestedPaths<T[K]>}`
    : K;
}[keyof T];
```

**Ready to build type-safe forms? Open `challenge.ts` and start transforming those entities!**
