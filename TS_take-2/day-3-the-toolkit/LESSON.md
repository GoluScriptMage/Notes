# 🧰 Day 3: The Toolkit - Utility Types

## 🎮 Welcome to the Transformer Workshop! ⚡

You've conquered **The Guard** (unions) and **The Factory** (generics). Now it's time to unlock **Utility Types** - TypeScript's **Swiss Army Knife** for transforming types! 🔧

Think of Utility Types as an **RPG Character Editor** where you can take an existing character (type) and transform it:

- 🎨 Make all stats optional
- 🔒 Lock certain attributes
- 📦 Pick only what you need
- 🚫 Remove what you don't want

---

## ⚠️ The Problem: Code Duplication Hell

### The Bad Code (Don't Do This! ❌)

Imagine you're building a user management system:

```typescript
// Original User interface
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role: "admin" | "editor" | "guest";
}

// Oh no! Now you need to update users...
// So you copy-paste and make everything optional 😱
interface UserUpdate {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
  age?: number;
  role?: "admin" | "editor" | "guest";
}

// Wait! You need to show user profiles publicly...
// So you copy-paste again and remove sensitive fields 😭
interface UserPreview {
  id: number;
  name: string;
  email: string;
  age: number;
  // Removed password and role
```

### 🤔 What's Wrong With This?

**Problems:**

1. ❌ **Violates DRY (Don't Repeat Yourself)** - Same fields copied 4 times!
2. ❌ **Maintenance Nightmare** - If `User` changes, you update 4 places!
3. ❌ **Error-Prone** - Easy to forget updating one interface
4. ❌ **Bloated Codebase** - 100+ lines for what should be 10 lines

**What if `User` gets a new field?** You have to manually update ALL interfaces! 😱

---

## ✨ The Solution: Utility Types (The Swiss Army Knife!)

**With Utility Types:**

```typescript
// ✅ ONE source of truth
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role: "admin" | "editor" | "guest";
}

// ✅ Transform it instantly!
type UserUpdate = Partial<User>; // All optional
type UserPreview = Omit<User, "password" | "role">; // Hide sensitive data
type ReadonlyUser = Readonly<User>; // Make immutable

// If User changes, these automatically update! ✨
```

**Benefits:**

- ✅ **DRY** - No duplication!
- ✅ **Type-Safe** - Changes propagate automatically
- ✅ **Maintainable** - Update one place, done!
- ✅ **Professional** - This is how top-tier codebases work

---

## 🧰 The Toolbox: 5 Essential Utility Types

---

### 1️⃣ `Partial<T>` - The Character Creator 🎨

**What it does:** Makes ALL properties optional.

**Think of it like:** A game's character customization screen where you can choose to change just the hair, or just the eyes, or nothing at all!

**Syntax:**

```typescript
Partial<User>; // All User fields become optional
```

**Example:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Without Partial (manual)
interface UserUpdate {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
}

// With Partial (automatic!)
type UserUpdate = Partial<User>;

// Now you can update just one field:
function updateUser(id: number, updates: UserUpdate) {
  // updates can be: { name: "John" }
  // or: { email: "john@example.com", password: "new123" }
  // or: {} (nothing!)
}

updateUser(1, { name: "Alice" }); // ✅ Valid
updateUser(2, { email: "bob@example.com", password: "secure" }); // ✅ Valid
updateUser(3, {}); // ✅ Valid (no updates)
```

**Real-World Use Case:** PATCH API requests where users update their profile one field at a time!

---

### 2️⃣ `Required<T>` - Strict Mode 🔒

**What it does:** Makes ALL properties required (opposite of Partial).

**Think of it like:** A mandatory form where every field must be filled - no skipping!

**Syntax:**

```typescript
Required<User>; // All User fields become required
```

**Example:**

```typescript
interface UserDraft {
  id?: number;
  name?: string;
  email?: string;
}

// When creating a user, we need everything!
type CompleteUser = Required<UserDraft>;

function createUser(user: CompleteUser) {
  // Must have id, name, AND email
  console.log(`Creating user: ${user.name}`);
}

// createUser({ name: "Alice" });  // ❌ Error: missing id and email
createUser({ id: 1, name: "Alice", email: "alice@example.com" }); // ✅ Valid
```

---

### 3️⃣ `Pick<T, K>` - The Backpack Packer 🎒

**What it does:** Selects ONLY specific properties from a type.

**Think of it like:** Packing a backpack for a trip - you only take what you need (not your entire wardrobe!).

**Syntax:**

```typescript
Pick<User, "id" | "email">; // Only id and email
```

**Example:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  age: number;
  role: "admin" | "editor" | "guest";
}

// We only need id and email for login
type LoginCredentials = Pick<User, "id" | "email">;
// Result: { id: number; email: string; }

// We only need name and age for display
type UserCard = Pick<User, "name" | "age">;
// Result: { name: string; age: number; }

function displayUserCard(user: UserCard) {
  console.log(`${user.name} (${user.age} years old)`);
}

displayUserCard({ name: "Alice", age: 25 }); // ✅ Valid
// displayUserCard({ name: "Bob", age: 30, email: "bob@example.com" });  // ❌ Error: email not allowed
```

---

### 4️⃣ `Omit<T, K>` - The Bouncer 🚫

**What it does:** Removes specific properties from a type (opposite of Pick).

**Think of it like:** A bouncer at a club - everyone gets in EXCEPT the people on the ban list!

**Syntax:**

```typescript
Omit<User, "password">; // Everything except password
```

**Example:**

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string; // Sensitive!
  role: "admin" | "editor" | "guest"; // Sensitive!
}

// Remove sensitive data before sending to frontend
type PublicUser = Omit<User, "password" | "role">;
// Result: { id: number; name: string; email: string; }

function sendToFrontend(user: PublicUser) {
  // password and role are NOT available here
  return user;
}

const safeUser: PublicUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  // password and role cannot be included
};
```

**Real-World Use Case:** Removing sensitive fields (passwords, tokens, internal IDs) before sending data to the client!

---

### 5️⃣ `Record<K, T>` - The Locker Room 🗄️

**What it does:** Creates an object type with specified keys and value types.

**Think of it like:** A row of labeled lockers where each locker (key) holds a specific type of item (value).

**Syntax:**

```typescript
Record<"admin" | "editor", string[]>; // Keys are roles, values are arrays
```

**Example:**

```typescript
// Define user roles
type UserRole = "admin" | "editor" | "guest";

// Map each role to permissions
type RolePermissions = Record<UserRole, string[]>;
// Result: {
//   admin: string[];
//   editor: string[];
//   guest: string[];
// }

const permissions: RolePermissions = {
  admin: ["read", "write", "delete", "manage_users"],
  editor: ["read", "write"],
  guest: ["read"],
};

function checkPermission(role: UserRole, action: string): boolean {
  return permissions[role].includes(action);
}

console.log(checkPermission("admin", "delete")); // true
console.log(checkPermission("guest", "write")); // false
```

**Another Example: Translation Dictionary**

```typescript
type Language = "en" | "es" | "fr";
type Translations = Record<Language, string>;

const greeting: Translations = {
  en: "Hello",
  es: "Hola",
  fr: "Bonjour",
};

function greet(lang: Language): string {
  return greeting[lang];
}
```

---

## 🌍 Real-World Usage Examples

### 🔧 Example 1: API Request/Response

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// POST /users - Create user (all fields required except auto-generated ones)
type CreateUserRequest = Omit<User, "id" | "createdAt" | "updatedAt">;

// PATCH /users/:id - Update user (all fields optional)
type UpdateUserRequest = Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;

// GET /users - Public response (hide password)
type UserResponse = Omit<User, "password">;

function createUser(data: CreateUserRequest): UserResponse {
  // ... create user logic
  return {
    id: 1,
    name: data.name,
    email: data.email,
    createdAt: new Date(),
    updatedAt: new Date(),
    // No password in response!
  };
}

function updateUser(id: number, data: UpdateUserRequest): UserResponse {
  // Can update just name, or just email, or both!
  // ...
}
```

### 🔧 Example 2: Configuration System

```typescript
interface AppConfig {
  apiUrl: string;
  timeout: number;
  retries: number;
  debugMode: boolean;
  theme: "light" | "dark";
}

// Default config (all fields required)
const defaultConfig: AppConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
  debugMode: false,
  theme: "light",
};

// User can override any config
type UserConfig = Partial<AppConfig>;

function initApp(userConfig: UserConfig = {}) {
  const config: AppConfig = { ...defaultConfig, ...userConfig };
  console.log("App initialized with", config);
}

// User only needs to specify what they want to change
initApp({ theme: "dark", debugMode: true });
```

---

## � Quick Reference Cheat Sheet

| Utility Type   | What It Does                        | Use When                                   |
| -------------- | ----------------------------------- | ------------------------------------------ |
| `Partial<T>`   | Makes all properties optional       | Update/PATCH APIs, optional config         |
| `Required<T>`  | Makes all properties required       | Creating entities, validation              |
| `Pick<T, K>`   | Selects specific properties         | Need subset of data                        |
| `Omit<T, K>`   | Removes specific properties         | Hide sensitive data, exclude fields        |
| `Record<K, T>` | Creates object with key-value types | Mappings, dictionaries, permission systems |

---

## 💡 Pro Tips

### ✨ Tip 1: Combine Utility Types!

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

// Pick specific fields AND make them optional
type ProductPreview = Partial<Pick<Product, "name" | "price">>;

// Omit fields AND make the rest required
type CreateProduct = Required<Omit<Product, "id">>;
```

### ✨ Tip 2: Use with Generics for Maximum Power!

```typescript
function updateEntity<T>(id: number, updates: Partial<T>) {
  // Works with ANY entity type!
}

updateEntity<User>(1, { name: "Alice" });
updateEntity<Product>(2, { price: 99.99 });
```

### ✨ Tip 3: Type-Safe Object Keys

```typescript
type UserRole = "admin" | "editor" | "guest";

// This FORCES you to define all roles (TypeScript will error if you miss one!)
const roleColors: Record<UserRole, string> = {
  admin: "red",
  editor: "blue",
  guest: "gray",
  // If you forget a role, TypeScript will complain!
};
```

---

## 🚀 What You've Learned

✅ Why utility types exist (DRY principle)  
✅ `Partial<T>` - Make everything optional  
✅ `Required<T>` - Make everything required  
✅ `Pick<T, K>` - Select specific fields  
✅ `Omit<T, K>` - Exclude specific fields  
✅ `Record<K, T>` - Create key-value mappings  
✅ Real-world API patterns  
✅ How to combine utility types

---

## 🎯 Ready for Challenges?

Now that you understand the toolkit, it's time to build something real!

Head over to **CHALLENGE.md** and put your skills to the test! 💪

---

<div align="center">

**🧰 You've unlocked the Type Transformer! 🧰**

_May your types always be DRY and your code maintainable._

**Next:** Complete the challenges in `CHALLENGE.md`! 🚀

</div>

// Show only combat stats
type CombatStats = Pick<Character, "health" | "strength">;
// { health: number; strength: number }

````

Like showing only combat stats on the battle screen!

### Omit - Hide Specific Stats

```typescript
// Hide mana for warrior class
type WarriorStats = Omit<Character, "mana" | "intelligence">;
// { health: number; strength: number; agility: number }
````

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
