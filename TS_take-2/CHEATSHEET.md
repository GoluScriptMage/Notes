# 📚 TypeScript Speed Run - Cheat Sheet

Quick reference for all the patterns you'll learn!

---

## 🛡️ Day 1: The Guard (Unions & Narrowing)

### Basic Pattern

```typescript
type Success = { status: "success"; data: string };
type Error = { status: "error"; error: string };
type Result = Success | Error;

function handle(result: Result) {
  switch (result.status) {
    case "success":
      return result.data;
    case "error":
      return result.error;
  }
}
```

### Key Rules

- ✅ Use literal types ('loading', not string)
- ✅ Common discriminator property (status, type, kind)
- ✅ Switch statements for clarity
- ✅ Each variant has unique properties

---

## 🏭 Day 2: The Factory (Generics)

### Basic Pattern

```typescript
function identity<T>(value: T): T {
  return value;
}

const num = identity(42); // number
const str = identity("hello"); // string
```

### With Constraints

```typescript
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength("hello"); // ✅ OK
getLength([1, 2, 3]); // ✅ OK
getLength(42); // ❌ Error
```

### Generic Interfaces

```typescript
interface Box<T> {
  value: T;
  unwrap(): T;
}

const numberBox: Box<number> = {
  value: 42,
  unwrap() {
    return this.value;
  },
};
```

---

## 🧰 Day 3: The Toolkit (Utility Types)

### Partial<T>

Makes all properties optional

```typescript
interface User {
  name: string;
  age: number;
}
type PartialUser = Partial<User>;
// { name?: string; age?: number }
```

### Required<T>

Makes all properties required

```typescript
type RequiredUser = Required<PartialUser>;
// { name: string; age: number }
```

### Pick<T, K>

Select specific properties

```typescript
type UserPreview = Pick<User, "name">;
// { name: string }
```

### Omit<T, K>

Exclude specific properties

```typescript
type UserWithoutAge = Omit<User, "age">;
// { name: string }
```

### Record<K, T>

Create an object type with specific keys

```typescript
type Scores = Record<string, number>;
// { [key: string]: number }
```

### Readonly<T>

Make all properties readonly

```typescript
type ImmutableUser = Readonly<User>;
// { readonly name: string; readonly age: number }
```

---

## 🌐 Bonus: Socket.io + TypeScript

### Typed Events

```typescript
interface ServerToClientEvents {
  message: (data: string) => void;
  userJoined: (user: User) => void;
}

interface ClientToServerEvents {
  sendMessage: (msg: string) => void;
}

const io: Server<ClientToServerEvents, ServerToClientEvents> = new Server();
```

---

## 💡 Quick Tips

### Type vs Interface

```typescript
// Use type for unions, intersections
type Status = "idle" | "loading" | "error";

// Use interface for object shapes
interface User {
  name: string;
  age: number;
}
```

### Union vs Intersection

```typescript
// Union: Can be EITHER type
type StringOrNumber = string | number;

// Intersection: Must have BOTH
type NamedEntity = Entity & { name: string };
```

### Type Assertions

```typescript
const value = someValue as string;
// or
const value = <string>someValue;
```

### Type Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

---

## 🚀 Common Patterns

### Option/Maybe Pattern

```typescript
type Option<T> = { some: T } | { none: true };
```

### Result Pattern

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

### Builder Pattern

```typescript
class QueryBuilder<T> {
  where<K extends keyof T>(key: K, value: T[K]): this {
    // ...
    return this;
  }
}
```

---

## 🐛 Debugging Tips

### See Inferred Types

```typescript
// Hover over variables in VS Code
const x = [1, 2, 3]; // number[]
```

### Use Type Annotations

```typescript
// Help TypeScript understand your intent
const users: User[] = [];
```

### Check with `satisfies`

```typescript
const config = {
  port: 3000,
  host: "localhost",
} satisfies Config;
```

---

## 📖 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Type Challenges](https://github.com/type-challenges/type-challenges)

---

**Print this page and keep it handy!** 📄
