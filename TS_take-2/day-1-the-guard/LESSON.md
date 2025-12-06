# 🛡️ Day 1: The Guard - LESSON

## Welcome to Day 1! 🎉

Today you're learning the **single most important pattern** in professional TypeScript: **Discriminated Unions** and **Type Narrowing**.

This is how libraries like Redux, React Router, and state machines handle complex states safely. Master this, and you're already ahead of 70% of TypeScript developers.

---

## 🎯 What Problem Are We Solving?

### The Chaos of Multiple States

Imagine you're building an app that fetches user data. At any moment, your app could be in one of these states:

- 🔄 **Loading**: Waiting for the server
- ✅ **Success**: Got the data
- ❌ **Error**: Something went wrong

In vanilla JavaScript, you might do this:

```javascript
// ⚠️ DANGER ZONE - JavaScript
const response = {
  isLoading: false,
  data: null,
  error: "Network failure",
};

// What happens here? 🤔
console.log(response.data.name); // CRASH! data is null but error exists
```

**The Problem**: Nothing stops you from having INVALID combinations like:

- `isLoading: false` + `data: null` + `error: null` ← What state is this?!
- `isLoading: true` + `data: {...}` ← Loading... but data exists?

This is called **impossible states**, and they cause bugs.

---

## 🛡️ The Solution: Discriminated Unions

**Discriminated Unions** (also called "Tagged Unions") force you to handle each state EXPLICITLY and make impossible states IMPOSSIBLE.

### The Magic Ingredient: A Discriminator

Each variant in the union has a **unique literal type** in a common property (usually called `type`, `kind`, or `status`).

Think of it like this:

---

## 🎪 Analogy: The ID Badge System

Imagine you're a security guard at a tech company. Visitors wear different colored badges:

### 🟦 Blue Badge: Employee

```typescript
{
  type: "employee",     // ← The discriminator
  badgeNumber: 12345,
  department: "Engineering"
}
```

### 🟨 Yellow Badge: Contractor

```typescript
{
  type: "contractor",   // ← The discriminator
  company: "Acme Corp",
  projectCode: "XYZ"
}
```

### 🟥 Red Badge: Guest

```typescript
{
  type: "guest",        // ← The discriminator
  sponsor: "Alice",
  validUntil: "5pm"
}
```

**The Rule**: You can ONLY access the fields that belong to the badge type you're currently checking.

If someone shows you a **Guest** badge, you DON'T check for `badgeNumber` (employees only) or `company` (contractors only). You check `sponsor` and `validUntil`.

TypeScript enforces this at compile time! 🎯

---

## 🔍 How Type Narrowing Works

When you check the `type` field, TypeScript **narrows** the type automatically:

```typescript
type Visitor = Employee | Contractor | Guest;

function checkBadge(visitor: Visitor) {
  // TypeScript only knows it's SOME kind of visitor
  console.log(visitor.type); // ✅ OK - all have 'type'
  console.log(visitor.badgeNumber); // ❌ ERROR - only employees have this

  // Now let's narrow:
  if (visitor.type === "employee") {
    // TypeScript KNOWS it's an Employee here!
    console.log(visitor.badgeNumber); // ✅ OK
    console.log(visitor.department); // ✅ OK
    console.log(visitor.company); // ❌ ERROR - employees don't have this
  }
}
```

**TypeScript tracks what you've checked and adjusts the type automatically!**

---

## 💻 Real Example: API Response States

Let's apply this to our loading example:

```typescript
// Define each state as its own type
type LoadingState = {
  status: "loading";
  // No data or error when loading
};

type SuccessState = {
  status: "success";
  data: { name: string; email: string };
  // No error when successful
};

type ErrorState = {
  status: "error";
  error: string;
  // No data when errored
};

// The union: Response can ONLY be ONE of these
type ApiResponse = LoadingState | SuccessState | ErrorState;
```

Now let's handle it safely:

```typescript
function handleResponse(response: ApiResponse) {
  switch (response.status) {
    case "loading":
      // TypeScript knows: response is LoadingState
      return "⏳ Please wait...";

    case "success":
      // TypeScript knows: response is SuccessState
      return `✅ Welcome, ${response.data.name}!`;

    case "error":
      // TypeScript knows: response is ErrorState
      return `❌ Error: ${response.error}`;
  }

  // TypeScript enforces exhaustiveness!
  // If you forget a case, you'll get an error
}
```

---

## 🎯 Key Benefits

### 1. **Impossible States Are Impossible**

You can't have `status: "success"` without `data`.  
You can't have `status: "error"` without `error`.

### 2. **Auto-Completion**

Inside each case, VS Code knows EXACTLY what fields are available.

### 3. **Exhaustiveness Checking**

If you add a new state later (like `"timeout"`), TypeScript forces you to handle it everywhere.

### 4. **Refactoring Safety**

Rename `error` to `errorMessage`? TypeScript shows you EVERY place you need to update.

---

## 🚦 Another Analogy: Traffic Light

A traffic light can only be in ONE state at a time:

```typescript
type RedLight = {
  color: "red";
  timeRemaining: number; // seconds until green
};

type YellowLight = {
  color: "yellow";
  warning: string; // "Prepare to stop"
};

type GreenLight = {
  color: "green";
  pedestrianCrossing: boolean;
};

type TrafficLight = RedLight | YellowLight | GreenLight;
```

Now write a function:

```typescript
function getInstruction(light: TrafficLight): string {
  switch (light.color) {
    case "red":
      return `🛑 STOP! (${light.timeRemaining}s remaining)`;

    case "yellow":
      return `⚠️ ${light.warning}`;

    case "green":
      const crossing = light.pedestrianCrossing
        ? " (Watch for pedestrians)"
        : "";
      return `✅ GO!${crossing}`;
  }
}
```

Each state has DIFFERENT properties, and TypeScript keeps you safe!

---

## 🧠 Mental Model

Think of Discriminated Unions as:

1. **A shape sorter toy** - Each shape only fits through its matching hole
2. **ID badges** - Different access levels with different properties
3. **Train switches** - You can only go down ONE track at a time

The discriminator (`type`, `status`, `kind`, etc.) is the **key** that tells TypeScript which "track" you're on.

---

## 📚 Technical Terms

### Discriminated Union

A union type where each member has a common property with a unique literal type.

### Type Narrowing

The process of refining a broader type into a more specific type.

### Exhaustiveness Checking

TypeScript's ability to enforce that you've handled ALL possible cases.

### Type Guard

A condition that narrows the type (like `if (x.type === "something")`).

---

## 🎨 Common Discriminators

You'll see these patterns in the wild:

```typescript
// Pattern 1: status
type State = LoadingState | SuccessState | ErrorState;
// { status: "loading" | "success" | "error" }

// Pattern 2: type
type Shape = Circle | Square | Triangle;
// { type: "circle" | "square" | "triangle" }

// Pattern 3: kind
type Node = TextNode | ElementNode | CommentNode;
// { kind: "text" | "element" | "comment" }

// Pattern 4: tag (less common)
type Event = ClickEvent | KeyEvent | ScrollEvent;
// { tag: "click" | "key" | "scroll" }
```

All do the same thing - they discriminate between variants!

---

## ⚡ Pro Tips

### Tip 1: Use `switch` Instead of `if/else`

```typescript
// ✅ Good - clear and exhaustive
switch (response.status) {
  case "loading":
    return "Loading...";
  case "success":
    return "Success!";
  case "error":
    return "Error!";
}

// ❌ Harder to maintain
if (response.status === "loading") return "Loading...";
else if (response.status === "success") return "Success!";
else if (response.status === "error") return "Error!";
```

### Tip 2: Add a `default` Case for Safety

```typescript
switch (response.status) {
  case "loading":
    return "Loading...";
  case "success":
    return "Success!";
  case "error":
    return "Error!";
  default:
    // This helps catch bugs if you add new states
    const exhaustive: never = response;
    throw new Error(`Unhandled case: ${exhaustive}`);
}
```

### Tip 3: Keep Discriminators Simple

Use string literals, not variables:

```typescript
// ✅ Good
type State = { status: "idle" } | { status: "active" };

// ❌ Avoid
const IDLE = "idle";
type State = { status: typeof IDLE } | { status: "active" };
```

---

## 🎯 What You'll Build Today

In the challenges, you'll:

1. ✅ Handle a basic API response (loading/success/error)
2. 🚦 Build a traffic light controller
3. 📦 Create a package delivery tracker
4. 🎮 Model a game character's states
5. 🔥 **BOSS**: Build a state machine with transitions

---

## 🚀 Ready for the Challenge?

You now understand:

- ✅ Why discriminated unions exist
- ✅ How type narrowing works
- ✅ When to use switch statements
- ✅ How TypeScript keeps you safe

**Time to put it into practice!**

Head to [CHALLENGE.md](./CHALLENGE.md) and prove your skills! 💪

---

## 🎁 Bonus: Real-World Usage

You'll see this pattern EVERYWHERE:

**Redux Actions:**

```typescript
type Action =
  | { type: "USER_LOGIN"; payload: User }
  | { type: "USER_LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> };
```

**React Router:**

```typescript
type Route =
  | { path: "/"; component: Home }
  | { path: "/user/:id"; component: UserProfile }
  | { path: "*"; component: NotFound };
```

**GraphQL Results:**

```typescript
type Result =
  | { __typename: "User"; id: string; name: string }
  | { __typename: "Error"; message: string };
```

This pattern is the **backbone of type-safe state management**!

---

<div align="center">

**"Master the Guard, and complex states become simple."** 🛡️

[Next: Take the Challenge →](./CHALLENGE.md)

</div>
