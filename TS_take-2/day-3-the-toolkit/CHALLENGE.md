# 🧰 Day 3: The Toolkit - CHALLENGES

## 🎯 Mission: CodeSync User Management System

You've been hired to build the type system for **CodeSync** - a collaborative coding platform. Your job is to create flexible, maintainable types using utility types!

**Remember:** Don't repeat yourself! Use utility types to transform existing types.

---

## 🟢 Challenge 1: The Profile Update (Warm-Up)

### The Scenario

Users want to update their profiles, but they should only need to send the fields they're changing. For example:

- Update just their name
- Update just their email
- Update multiple fields at once

### Your Task

**Step 1:** Create a `User` interface with these properties:

- `id`: number
- `username`: string
- `email`: string
- `age`: number
- `bio`: string

**Step 2:** Create a `UserUpdate` type using `Partial<T>` so users can update just one field at a time.

**Step 3:** Write a function `updateUserProfile(userId: number, updates: UserUpdate)` that logs what's being updated.

**Step 4:** Test it with these scenarios:

```typescript
updateUserProfile(1, { username: "alice123" });
updateUserProfile(2, { email: "bob@example.com", bio: "TypeScript lover" });
updateUserProfile(3, {}); // No updates
```

**Expected Output:**

```
Updating user 1 with: { username: 'alice123' }
Updating user 2 with: { email: 'bob@example.com', bio: 'TypeScript lover' }
Updating user 3 with: {}
```

---

## 🟡 Challenge 2: The Privacy Filter (The Filter)

### The Scenario

When displaying user profiles on the website, you **MUST** hide sensitive information:

- `id` (internal database ID)
- `role` (admin permissions)

Only show: `username`, `email`, `age`, and `bio`.

### Your Task

**Step 1:** Use your `User` interface from Challenge 1 and add a new field:

- `role`: string

**Step 2:** Create a `PublicProfile` type using `Omit<T, K>` to exclude `id` and `role`.

**Step 3:** Write a function `displayPublicProfile(user: PublicProfile)` that logs the public information.

**Step 4:** Test it:

```typescript
const publicUser: PublicProfile = {
  username: "charlie",
  email: "charlie@example.com",
  age: 28,
  bio: "Full-stack developer",
};

displayPublicProfile(publicUser);
```

**Expected Output:**

```
Public Profile:
Username: charlie
Email: charlie@example.com
Age: 28
Bio: Full-stack developer
```

**Challenge Question:** Try adding `id` or `role` to `publicUser`. What happens?

---

## 🟡 Challenge 3: The Role Map (The Record)

### The Scenario

CodeSync has three user roles, and each role has different permissions:

- **admin**: Can do everything
- **editor**: Can read and write
- **guest**: Can only read

You need to create a type-safe permission system.

### Your Task

**Step 1:** Define a union type:

```typescript
type UserRole = "admin" | "editor" | "guest";
```

**Step 2:** Use `Record<K, T>` to create a `RolePermissions` type that maps each role to an array of strings (the permissions).

**Step 3:** Create a `permissions` object of type `RolePermissions`:

- `admin`: `["read", "write", "delete", "manage_users"]`
- `editor`: `["read", "write"]`
- `guest`: `["read"]`

**Step 4:** Write a function `hasPermission(role: UserRole, action: string): boolean` that checks if a role has a specific permission.

**Step 5:** Test it:

```typescript
console.log(hasPermission("admin", "delete")); // true
console.log(hasPermission("editor", "write")); // true
console.log(hasPermission("guest", "delete")); // false
console.log(hasPermission("guest", "read")); // true
```

**Expected Output:**

```
true
true
false
true
```

**Bonus:** What happens if you forget to define permissions for one role? TypeScript will catch it!

---

## 🔴 Challenge 4: The Selective Picker (Pick Practice)

### The Scenario

For authentication, you only need the user's `id` and `email`. For displaying a user card, you only need `username` and `bio`.

### Your Task

**Step 1:** Using your `User` interface, create two new types:

- `LoginCredentials`: Use `Pick<T, K>` to select only `id` and `email`
- `UserCard`: Use `Pick<T, K>` to select only `username` and `bio`

**Step 2:** Write two functions:

- `login(credentials: LoginCredentials)`
- `renderUserCard(card: UserCard)`

**Step 3:** Test them:

```typescript
const creds: LoginCredentials = { id: 5, email: "test@example.com" };
login(creds);

const card: UserCard = { username: "diana", bio: "Design enthusiast" };
renderUserCard(card);
```

**Expected Output:**

```
Logging in user 5 with email: test@example.com
Rendering card for: diana - Design enthusiast
```

---

## 🔥 BOSS LEVEL: The Ultimate Config (Combo Challenge!)

### The Scenario

CodeSync has a page configuration system. Each page has these settings:

```typescript
interface PageSettings {
  title: string;
  url: string;
  theme: "light" | "dark";
  layout: "grid" | "list";
  showSidebar: boolean;
}
```

**Business Requirements:**

1. `title` and `url` are **always required** (can't create a page without them)
2. `theme` and `layout` are **optional** (will use defaults if not provided)
3. `showSidebar` is **not needed** for page creation (internal use only)

Your job: Create a `PageConfig` type that represents what users provide when creating a page.

### Your Task

**Challenge:** Create `PageConfig` by combining utility types to:

- **Require** `title` and `url`
- Make `theme` and `layout` **optional**
- **Exclude** `showSidebar` entirely

**Hints:**

- You'll need to use at least 2 different utility types
- Think about combining `Pick`, `Omit`, and `Partial`
- There are multiple correct solutions!

**Step 1:** Create the `PageConfig` type.

**Step 2:** Write a function `createPage(config: PageConfig)` that creates a page with defaults for missing values.

**Step 3:** Test it with these scenarios:

```typescript
// Valid: Has required fields
createPage({
  title: "Home",
  url: "/home",
});

// Valid: Has required fields + optional theme
createPage({
  title: "About",
  url: "/about",
  theme: "dark",
});

// Valid: Has everything optional
createPage({
  title: "Contact",
  url: "/contact",
  theme: "light",
  layout: "grid",
});

// Invalid: Missing required field (should give TypeScript error!)
// createPage({ title: "Broken" });  // ❌ Error: url is required

// Invalid: Has showSidebar (should give TypeScript error!)
// createPage({ title: "Bad", url: "/bad", showSidebar: true });  // ❌ Error
```

**Expected Output:**

```
Creating page: Home at /home with theme: light (default), layout: list (default)
Creating page: About at /about with theme: dark, layout: list (default)
Creating page: Contact at /contact with theme: light, layout: grid
```

**Success Criteria:**

- ✅ `title` and `url` are required
- ✅ `theme` and `layout` are optional
- ✅ `showSidebar` cannot be included
- ✅ TypeScript catches errors at compile time

---

## 🔥 NIGHTMARE MODE: The API Response Transformer (Ultra Hard!)

### The Scenario

Your backend API returns raw user data with extra metadata. You need to transform it for the frontend.

**Backend Response:**

```typescript
interface ApiUser {
  _id: string; // MongoDB ID
  username: string;
  email: string;
  passwordHash: string; // NEVER send to frontend!
  role: "admin" | "editor" | "guest";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    lastLogin: Date;
    loginCount: number;
  };
}
```

### Your Task

Create multiple transformed types:

**1. `FrontendUser`:**

- Remove: `_id`, `passwordHash`, `metadata`
- Add a **new field** `id: number` (generated from `_id`)
- Keep everything else

**2. `UserPreview`:**

- Use `FrontendUser` as base
- Only include: `id`, `username`, `isActive`

**3. `AdminUserView`:**

- Use `FrontendUser` as base
- Add back the `metadata` field
- Keep everything else

**Constraints:**

- You CANNOT manually write out all the fields
- You MUST use utility types (`Omit`, `Pick`, `Partial`, etc.)
- You MUST add the `id` field using intersection types (`&`)

**Step 1:** Create all three types.

**Step 2:** Write transform functions:

```typescript
function toFrontendUser(apiUser: ApiUser): FrontendUser { ... }
function toUserPreview(frontendUser: FrontendUser): UserPreview { ... }
function toAdminUserView(apiUser: ApiUser, frontendUser: FrontendUser): AdminUserView { ... }
```

**Step 3:** Test with sample data:

```typescript
const apiResponse: ApiUser = {
  _id: "507f1f77bcf86cd799439011",
  username: "emma",
  email: "emma@example.com",
  passwordHash: "$2b$10$...",
  role: "editor",
  isActive: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-12-13"),
  metadata: {
    lastLogin: new Date("2024-12-13"),
    loginCount: 42,
  },
};

const frontendUser = toFrontendUser(apiResponse);
console.log(frontendUser);

const preview = toUserPreview(frontendUser);
console.log(preview);

const adminView = toAdminUserView(apiResponse, frontendUser);
console.log(adminView);
```

**Hints:**

- For `FrontendUser`: Use `Omit` to remove fields, then use `&` to add `id`
- For `UserPreview`: Use `Pick` on `FrontendUser`
- For `AdminUserView`: Use `Pick` from `ApiUser` for metadata, combine with `FrontendUser`

This challenge will test EVERYTHING you learned! 💪🔥

---

## 🎯 Challenge Completion Checklist

Track your progress:

- [ ] Challenge 1: Profile Update (Warm-Up)
- [ ] Challenge 2: Privacy Filter
- [ ] Challenge 3: Role Map (Record)
- [ ] Challenge 4: Selective Picker (Pick)
- [ ] BOSS LEVEL: Ultimate Config
- [ ] NIGHTMARE MODE: API Response Transformer

---

## 💡 Tips for Success

1. **Read the lesson first!** Understanding the concepts makes the challenges easier.
2. **Start with the warm-up** - Don't jump straight to Boss Level.
3. **Test your types** - Try adding invalid fields to see TypeScript catch errors.
4. **Combine utility types** - Some challenges need 2+ utility types working together.
5. **Use hover tooltips** - Hover over your types in VS Code to see what TypeScript inferred.

---

## 🚀 When You're Done

Once you've completed all challenges:

1. Run your code with `ts-node challenge-X.ts` to verify
2. Check that TypeScript catches the intentional errors
3. Compare your solution with `SOLUTION.md` (after you try!)
4. Update your progress in the main README.md

---

<div align="center">

**🧰 Ready to Transform Types? 🧰**

_Create your challenge files in `/challenges` folder:_

- `challenge-1.ts`
- `challenge-2.ts`
- `challenge-3.ts`
- `challenge-4.ts`
- `boss-level.ts`
- `nightmare.ts`

**Good luck, Type Transformer!** ⚡✨

</div>
