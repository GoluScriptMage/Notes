# 🧰 Day 3: The Toolkit - LESSON

## Welcome to Day 3! 🎉

You've mastered **The Guard** (unions) and **The Factory** (generics). Today, you're unlocking **Utility Types** - TypeScript's built-in superpowers for transforming types.

This is how professionals:

- Create flexible APIs
- Transform interfaces on the fly
- Build type-safe configuration systems
- Avoid code duplication

These patterns are EVERYWHERE in production code. Let's master them! 🚀

---

## 🎯 What Problem Are We Solving?

### The Problem: Type Duplication

Imagine you have a `User` interface:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: "admin" | "user";
}
```

Now you need:

- A `UserPreview` (only `id` and `name`)
- A `UserUpdate` (all fields optional)
- A `ReadonlyUser` (can't modify fields)
- A `UserWithoutEmail` (exclude email for privacy)

**Without utility types:**

```typescript
// ❌ Repetitive and error-prone
interface UserPreview {
  id: number;
  name: string;
}

interface UserUpdate {
  id?: number;
  name?: string;
  email?: string;
  age?: number;
  role?: "admin" | "user";
}

// If User changes, you must manually update EVERYTHING! 😱
```

**With utility types:**

```typescript
// ✅ DRY (Don't Repeat Yourself)
type UserPreview = Pick<User, "id" | "name">;
type UserUpdate = Partial<User>;
type ReadonlyUser = Readonly<User>;
type UserWithoutEmail = Omit<User, "email">;

// If User changes, these automatically update! ✨
```

---

## 🎮 Analogy: Video Game Character Editor

Think of utility types like editing a character in an RPG:

### Pick - Select Specific Stats

```typescript
// Original character
interface Character {
  health: number;
  mana: number;
  strength: number;
  intelligence: number;
  agility: number;
}

// Show only combat stats
type CombatStats = Pick<Character, "health" | "strength">;
// { health: number; strength: number }
```

Like showing only combat stats on the battle screen!

### Omit - Hide Specific Stats

```typescript
// Hide mana for warrior class
type WarriorStats = Omit<Character, "mana" | "intelligence">;
// { health: number; strength: number; agility: number }
```

Like removing irrelevant stats for a class!

### Partial - Make Everything Optional

```typescript
// Character customization (pick what to change)
type CharacterUpdate = Partial<Character>;
// { health?: number; mana?: number; ... }
```

Like an upgrade screen where you choose what to improve!

### Readonly - Lock Stats

```typescript
// Final boss stats (can't be modified)
type BossStats = Readonly<Character>;
// { readonly health: number; readonly mana: number; ... }
```

Like a boss whose stats are fixed!

---

## 🧰 The Essential Utility Types

### 1. Partial<T>

Makes ALL properties optional.

```typescript
interface Config {
  host: string;
  port: number;
  secure: boolean;
}

type PartialConfig = Partial<Config>;
// {
//   host?: string
//   port?: number
//   secure?: boolean
// }

// Use case: Updates
function updateConfig(current: Config, updates: Partial<Config>): Config {
  return { ...current, ...updates };
}

const config: Config = { host: "localhost", port: 3000, secure: false };
updateConfig(config, { port: 8080 }); // Only update port!
```

### 2. Required<T>

Makes ALL properties required (opposite of Partial).

```typescript
interface OptionalUser {
  id?: number;
  name?: string;
}

type RequiredUser = Required<OptionalUser>;
// {
//   id: number
//   name: string
// }
```

### 3. Pick<T, K>

Select ONLY specific properties.

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  stock: number;
  category: string;
}

type ProductCard = Pick<Product, "id" | "name" | "price">;
// {
//   id: number
//   name: string
//   price: number
// }

// Perfect for API responses that don't need all fields!
```

### 4. Omit<T, K>

Exclude specific properties.

```typescript
type ProductWithoutStock = Omit<Product, "stock">;
// All Product fields EXCEPT stock

type PublicProduct = Omit<Product, "stock" | "description">;
// All Product fields EXCEPT stock and description
```

### 5. Record<K, T>

Create an object type with specific keys and value types.

```typescript
type UserRoles = "admin" | "user" | "guest";
type Permissions = Record<UserRoles, string[]>;
// {
//   admin: string[]
//   user: string[]
//   guest: string[]
// }

const permissions: Permissions = {
  admin: ["read", "write", "delete"],
  user: ["read", "write"],
  guest: ["read"],
};
```

### 6. Readonly<T>

Make ALL properties readonly.

```typescript
interface Point {
  x: number;
  y: number;
}

type ImmutablePoint = Readonly<Point>;
// {
//   readonly x: number
//   readonly y: number
// }

const point: ImmutablePoint = { x: 10, y: 20 };
// point.x = 30  // ❌ Error! Cannot assign to readonly property
```

### 7. Exclude<T, U>

Remove types from a union.

```typescript
type Status = "idle" | "loading" | "success" | "error";
type ActiveStatus = Exclude<Status, "idle">;
// 'loading' | 'success' | 'error'
```

### 8. Extract<T, U>

Extract types from a union.

```typescript
type Status = "idle" | "loading" | "success" | "error";
type PositiveStatus = Extract<Status, "success" | "idle">;
// 'success' | 'idle'
```

### 9. NonNullable<T>

Remove `null` and `undefined`.

```typescript
type MaybeString = string | null | undefined;
type DefinitelyString = NonNullable<MaybeString>;
// string
```

### 10. ReturnType<T>

Extract the return type of a function.

```typescript
function getUser() {
  return { id: 1, name: "Alice" };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string }
```

---

## 💻 Real-World Patterns

### Pattern 1: API Response Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// For listing users (don't send password!)
type UserList = Omit<User, "password">[];

// For creating users (no id or timestamps yet)
type UserCreate = Omit<User, "id" | "createdAt" | "updatedAt">;

// For updating users (all optional except id)
type UserUpdate = { id: number } & Partial<Omit<User, "id">>;
```

### Pattern 2: Form State

```typescript
interface FormData {
  username: string;
  email: string;
  password: string;
}

// All fields start as empty strings or undefined
type FormState = Partial<FormData>;

// Track which fields have errors
type FormErrors = Partial<Record<keyof FormData, string>>;

// Track which fields were touched
type FormTouched = Partial<Record<keyof FormData, boolean>>;
```

### Pattern 3: Configuration

```typescript
interface ServerConfig {
  host: string;
  port: number;
  ssl: boolean;
  cors: {
    origin: string;
    credentials: boolean;
  };
}

// Required base config
type RequiredConfig = Pick<ServerConfig, "host" | "port">;

// Optional overrides
type OptionalConfig = Partial<Omit<ServerConfig, keyof RequiredConfig>>;

// Final config type
type Config = RequiredConfig & OptionalConfig;
```

---

## 🎯 Combining Utility Types

The real power comes from COMBINING them:

```typescript
interface BlogPost {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create: No id or timestamps, published defaults to false
type CreatePost = Omit<BlogPost, "id" | "createdAt" | "updatedAt"> & {
  published?: boolean;
};

// Update: Only allow updating specific fields, all optional
type UpdatePost = Partial<Pick<BlogPost, "title" | "content" | "published">>;

// Public view: Hide author and timestamps
type PublicPost = Omit<BlogPost, "authorId" | "updatedAt">;

// Draft: Everything optional except id
type DraftPost = { id: number } & Partial<Omit<BlogPost, "id">>;
```

---

## ⚡ Pro Tips

### Tip 1: Use keyof for Dynamic Keys

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User; // 'id' | 'name' | 'email'

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Tip 2: Combine with Generics

```typescript
function updateEntity<T>(entity: T, updates: Partial<T>): T {
  return { ...entity, ...updates };
}
```

### Tip 3: Create Reusable Patterns

```typescript
// Make specific fields optional
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

interface User {
  id: number;
  name: string;
  email: string;
}

type UserWithOptionalEmail = Optional<User, "email">;
// { id: number; name: string; email?: string }
```

---

## 🎯 What You'll Build Today

In today's challenges, you'll:

1. ✅ Transform a Product interface with utilities
2. 🎮 Build a character customization system
3. 📝 Create type-safe form handlers
4. 🏗️ Build a configuration system
5. 🔥 **BOSS**: Create custom utility types

---

## 🚀 Ready for the Challenge?

You now understand:

- ✅ Why utility types exist
- ✅ How each utility type works
- ✅ When to use each one
- ✅ How to combine them
- ✅ Real-world patterns

**Time to practice!**

Head to [CHALLENGE.md](./CHALLENGE.md) and show your skills! 💪

---

<div align="center">

**"With the right tools, any type can be transformed."** 🧰

[Next: Take the Challenge →](./CHALLENGE.md)

</div>
