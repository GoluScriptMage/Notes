# Session 2: The Shape Shifters

**Generics as Type Functions**

## 🎯 Learning Objectives

- Master **Generics** as type-level programming, not just placeholders
- Build **constraint-based type manipulation** systems
- Create **flexible API wrappers** that scale across teams
- Implement **conditional types** and **mapped types** for real-world scenarios

---

## 🔥 The Challenge: Type-Safe API Framework

You're building a critical API framework that needs to handle dozens of different endpoint types while maintaining perfect type safety. The framework must be flexible enough to work with any data shape but strict enough to catch type errors at compile time.

**The Problem**: The code below compiles but has zero type safety. Your mission is to add generics that provide bulletproof type checking without sacrificing flexibility.

### Files to Work With:

1. **`challenge.ts`** - The broken API framework you need to fix
2. **`types.ts`** - Generic type definitions to implement
3. **`examples.ts`** - Real-world usage examples that must work
4. **`advanced.ts`** - Master-level generic challenges

---

## 📋 Rules for This Challenge

1. **NO `any` or `unknown`** - Use proper generic constraints
2. **Type inference must work** - Don't force manual type annotations
3. **Composability** - Generics should work together seamlessly
4. **Real-world ready** - Must handle edge cases gracefully

---

## 🎖️ Success Criteria

- [ ] All API calls are fully type-safe
- [ ] IntelliSense provides accurate endpoint suggestions
- [ ] Wrong property access shows compile-time errors
- [ ] Generic constraints prevent invalid operations
- [ ] Type inference works without manual annotations

---

## 💡 Key Concepts You'll Master

### Generics as Type Functions

```typescript
// Think of generics like functions that operate on types
type ApiResponse<TData> = {
  data: TData;
  status: number;
  headers: Record<string, string>;
};

// Just like functions can be composed:
// const result = transform(filter(data))
//
// Generic types can be composed:
// type Result = Paginated<Sorted<ApiResponse<User>>>
```

### Constraint-Based Programming

```typescript
// Constrain generics to specific shapes
interface Identifiable {
  id: string | number;
}

function updateEntity<T extends Identifiable>(
  entity: T,
  updates: Partial<T>
): T {
  return { ...entity, ...updates };
}
```

### Conditional Types

```typescript
// Types that make decisions based on other types
type ApiResult<T> = T extends { error: any }
  ? ErrorResponse<T["error"]>
  : SuccessResponse<T>;
```

### Mapped Types

```typescript
// Transform object types systematically
type OptionalKeys<T> = {
  [K in keyof T]?: T[K];
};

type RequiredKeys<T> = {
  [K in keyof T]-?: T[K];
};
```

**Ready to build type-safe APIs? Open `challenge.ts` and start adding generics!**
