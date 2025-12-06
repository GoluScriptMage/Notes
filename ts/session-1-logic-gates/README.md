# Session 1: The Logic Gates

**Unions & Narrowing Mastery**

## 🎯 Learning Objectives

- Master **Discriminated Unions** for real-world API responses
- Build **Type Guards** that actually protect your code
- Implement **exhaustive checking** with `never` type
- Handle complex state management with union narrowing

---

## 🔥 The Challenge: NetworkResponse Handler

You're building a network layer for a critical application. The API returns different response shapes based on the status. Your job is to handle all cases safely without any `any` types.

**The Problem**: The code below looks correct but has subtle type issues that will cause runtime crashes. Fix it using advanced TypeScript features.

### Files to Work With:

1. **`challenge.ts`** - The broken code you need to fix
2. **`types.ts`** - Type definitions (you may need to modify these)
3. **`test.ts`** - Test cases your solution must pass

---

## 📋 Rules for This Challenge

1. **NO `any` types** - Use proper type narrowing
2. **Exhaustive handling** - Handle all possible response states
3. **Type safety** - Accessing wrong properties should be compile-time errors
4. **Runtime safety** - No crashes when response format changes

---

## 🎖️ Success Criteria

- [ ] TypeScript compiler shows zero errors
- [ ] All test cases pass
- [ ] Code handles unexpected response states gracefully
- [ ] IntelliSense provides accurate suggestions

---

## 💡 Key Concepts You'll Master

### Discriminated Unions

```typescript
// Instead of loose unions like this:
type BadResponse = { data?: any; error?: string; loading?: boolean };

// Use discriminated unions like this:
type GoodResponse =
  | { status: "loading" }
  | { status: "success"; data: UserData }
  | { status: "error"; error: ErrorInfo };
```

### Type Guards

```typescript
// Custom type guards that actually work:
function isSuccessResponse(
  response: NetworkResponse
): response is SuccessResponse {
  return response.status === "success";
}
```

### Exhaustive Checking

```typescript
// Force yourself to handle all cases:
function handleResponse(response: NetworkResponse) {
  switch (response.status) {
    case "loading":
      return handleLoading(response);
    case "success":
      return handleSuccess(response);
    case "error":
      return handleError(response);
    default:
      const _exhaustive: never = response; // Compile error if case missed!
      return _exhaustive;
  }
}
```

**Ready? Open `challenge.ts` and start fixing the broken code!**
