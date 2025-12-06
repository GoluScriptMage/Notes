# 🏭 Day 2: The Factory - LESSON

## Welcome to Day 2! 🎉

Yesterday you mastered **The Guard** - handling multiple states safely. Today, you're learning **Generics** - the superpower that lets you write code that works with ANY type while staying type-safe.

This is the pattern behind:

- React's `useState<T>()` and `useRef<T>()`
- Array methods like `.map<U>()` and `.filter()`
- Promise `Promise<T>`
- Every reusable utility library ever

Master this, and you'll write code like the pros. 🚀

---

## 🎯 What Problem Are We Solving?

### The Problem: Repetitive Code

Imagine you need functions to return the first item of an array:

```typescript
// ❌ Bad: You'd need a function for EVERY type
function getFirstString(arr: string[]): string {
  return arr[0];
}

function getFirstNumber(arr: number[]): number {
  return arr[0];
}

function getFirstUser(arr: User[]): User {
  return arr[0];
}

// This is insane! 😱
```

### The Wrong Solution: `any`

```typescript
// ❌ Even worse: Lose all type safety
function getFirst(arr: any[]): any {
  return arr[0];
}

const firstNum = getFirst([1, 2, 3]); // Type is 'any' 😢
// No auto-complete, no type checking, no safety!
```

### The RIGHT Solution: Generics

```typescript
// ✅ Perfect: Works with ANY type, keeps type safety
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const firstNum = getFirst([1, 2, 3]); // Type: number ✅
const firstStr = getFirst(["a", "b", "c"]); // Type: string ✅
const firstUser = getFirst([user1, user2]); // Type: User ✅

// Auto-complete works! Type checking works! Magic! ✨
```

---

## 🎪 Analogy: The Magic Box

Think of generics like a **Magic Shipping Box** at a factory:

### The Regular Box (Without Generics)

```typescript
// ❌ Can only ship shoes
class ShoeBox {
  contents: Shoes;

  pack(item: Shoes) {
    this.contents = item;
  }
  unpack(): Shoes {
    return this.contents;
  }
}

// Need toys? Make another box!
class ToyBox {
  contents: Toy;

  pack(item: Toy) {
    this.contents = item;
  }
  unpack(): Toy {
    return this.contents;
  }
}
// This is exhausting! 😫
```

### The Magic Box (With Generics)

```typescript
// ✅ One box that adapts to whatever you put in it!
class MagicBox<T> {
  private contents: T;

  pack(item: T) {
    this.contents = item;
  }

  unpack(): T {
    return this.contents;
  }
}

// Now it works with ANYTHING:
const shoeBox = new MagicBox<Shoes>();
shoeBox.pack(nikes); // ✅ Only accepts Shoes
const shoes = shoeBox.unpack(); // ✅ Returns Shoes

const toyBox = new MagicBox<Toy>();
toyBox.pack(lego); // ✅ Only accepts Toy
const toy = toyBox.unpack(); // ✅ Returns Toy

// ONE class, infinite types! 🎁
```

**Key Insight**: The `<T>` is like a **label holder** on the box. When you pack something, the box "remembers" what type it is!

---

## 🔍 How Generics Work

### The Syntax

```typescript
function identity<T>(value: T): T {
  return value;
}
//           ^^^    parameter type
//                        ^^^  return type
// <T> is the "type parameter" - it's a placeholder for any type
```

### When You Call It

```typescript
// TypeScript infers T from the argument:
const num = identity(42); // T = number
const str = identity("hello"); // T = string
const obj = identity({ age: 30 }); // T = { age: number }

// Or you can specify explicitly:
const num = identity<number>(42);
const str = identity<string>("hello");
```

Think of `<T>` like a variable, but for **types** instead of values:

```typescript
// Regular function parameter:
function add(x: number) {
  return x + 1;
}
//          ^ value parameter

// Generic type parameter:
function wrap<T>(value: T) {
  return [value];
}
//           ^ type parameter
```

---

## 💻 Real Examples

### Example 1: Wrapping Values

```typescript
function wrapInArray<T>(item: T): T[] {
  return [item];
}

const numbers = wrapInArray(42); // number[]
const strings = wrapInArray("hello"); // string[]
const users = wrapInArray({ name: "A" }); // { name: string }[]
```

**What's happening**:

1. You call `wrapInArray(42)`
2. TypeScript sees the argument is `number`
3. TypeScript sets `T = number`
4. Return type becomes `number[]`

### Example 2: Pair Creator

```typescript
function makePair<A, B>(first: A, second: B): [A, B] {
  return [first, second];
}

const pair1 = makePair("age", 30); // [string, number]
const pair2 = makePair(true, "yes"); // [boolean, string]
const pair3 = makePair(1, 2); // [number, number]
```

**You can have MULTIPLE type parameters!** `<A, B, C, ...>`

### Example 3: Filtering Arrays

```typescript
function filterByProperty<T, K extends keyof T>(
  array: T[],
  property: K,
  value: T[K]
): T[] {
  return array.filter((item) => item[property] === value);
}

interface User {
  name: string;
  age: number;
  role: "admin" | "user";
}

const users: User[] = [
  { name: "Alice", age: 30, role: "admin" },
  { name: "Bob", age: 25, role: "user" },
];

// All fully type-safe:
const admins = filterByProperty(users, "role", "admin"); // ✅
const adults = filterByProperty(users, "age", 30); // ✅
// filterByProperty(users, 'age', 'thirty')              // ❌ Error!
// filterByProperty(users, 'invalid', 'x')               // ❌ Error!
```

---

## 🎯 Generic Constraints

Sometimes you need to **restrict** what types can be used:

### Without Constraints (Too Broad)

```typescript
function getLength<T>(item: T): number {
  return item.length; // ❌ Error! T might not have .length
}
```

### With Constraints (Just Right)

```typescript
// Only allow types that have a 'length' property:
function getLength<T extends { length: number }>(item: T): number {
  return item.length; // ✅ Safe!
}

getLength("hello"); // ✅ string has .length
getLength([1, 2, 3]); // ✅ array has .length
getLength(42); // ❌ Error! number doesn't have .length
```

### Common Constraints

```typescript
// Must be an object
function clone<T extends object>(obj: T): T {
  return { ...obj };
}

// Must have an 'id' property
function findById<T extends { id: number }>(
  items: T[],
  id: number
): T | undefined {
  return items.find((item) => item.id === id);
}

// Must be a specific type or its subtype
function processUser<T extends User>(user: T): void {
  console.log(user.name);
}
```

---

## 🎨 Generic Interfaces and Classes

### Generic Interface

```typescript
interface Box<T> {
  value: T;
  isEmpty(): boolean;
  map<U>(fn: (value: T) => U): Box<U>;
}

class BoxImpl<T> implements Box<T> {
  constructor(public value: T) {}

  isEmpty(): boolean {
    return this.value === null || this.value === undefined;
  }

  map<U>(fn: (value: T) => U): Box<U> {
    return new BoxImpl(fn(this.value));
  }
}

const numberBox = new BoxImpl(42);
const stringBox = numberBox.map((n) => n.toString()); // Box<string>
const lengthBox = stringBox.map((s) => s.length); // Box<number>
```

### Generic Class

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
// numberStack.push("three")  // ❌ Error! Must be number

const stringStack = new Stack<string>();
stringStack.push("hello");
stringStack.push("world");
```

---

## 🧠 Mental Models

Think of generics as:

1. **A Mold** - Like a cake mold that works for any batter (chocolate, vanilla, etc.)
2. **A Template** - Like a form letter where you fill in the name
3. **A Label Maker** - Automatically labels containers with their contents
4. **A Type Variable** - Just like `x` in math, but for types

### The Pattern

```typescript
function doSomething<T>(input: T): T {
  //               ^^^   ^^^^      ^^^
  //                |      |        └─ Return type uses T
  //                |      └─ Parameter uses T
  //                └─ Declare T as a type parameter

  return input;
}
```

**Rule of Thumb**: Wherever you see `<T>`, think "this will be filled in with a real type later".

---

## 💡 Common Use Cases

### 1. Array Utilities

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

function shuffle<T>(arr: T[]): T[] {
  // shuffle logic
  return arr;
}
```

### 2. API Response Wrappers

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchUser(): Promise<ApiResponse<User>> {
  // fetch logic
}

async function fetchPosts(): Promise<ApiResponse<Post[]>> {
  // fetch logic
}
```

### 3. State Management

```typescript
function createState<T>(initialValue: T) {
  let value = initialValue;

  return {
    get: () => value,
    set: (newValue: T) => {
      value = newValue;
    },
    update: (fn: (current: T) => T) => {
      value = fn(value);
    },
  };
}

const count = createState(0);
count.set(5);
count.update((n) => n + 1); // 6
```

### 4. Event Handlers

```typescript
class EventEmitter<Events extends Record<string, any>> {
  on<K extends keyof Events>(
    event: K,
    handler: (data: Events[K]) => void
  ): void {
    // implementation
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    // implementation
  }
}

// Usage:
interface AppEvents {
  "user:login": { userId: string; timestamp: Date };
  "user:logout": { userId: string };
  "message:sent": { text: string; to: string };
}

const emitter = new EventEmitter<AppEvents>();
emitter.on("user:login", (data) => {
  // data is typed as { userId: string; timestamp: Date }
  console.log(data.userId);
});
```

---

## ⚡ Pro Tips

### Tip 1: Let TypeScript Infer When Possible

```typescript
// ❌ Redundant
const result = identity<string>("hello");

// ✅ Cleaner
const result = identity("hello"); // TypeScript knows it's string
```

### Tip 2: Use Meaningful Names

```typescript
// ❌ Confusing
function merge<A, B, C>(a: A, b: B): C {
  /* ... */
}

// ✅ Clear
function merge<TFirst, TSecond, TResult>(
  first: TFirst,
  second: TSecond
): TResult {
  /* ... */
}

// Convention: T, U, V for simple cases, descriptive names for complex ones
```

### Tip 3: Constraints Make Life Easier

```typescript
// Without constraint: TypeScript can't help you
function sort<T>(arr: T[]): T[] {
  return arr.sort(); // ❌ Error! T might not be comparable
}

// With constraint: TypeScript knows what you can do
function sort<T extends number | string>(arr: T[]): T[] {
  return arr.sort(); // ✅ Works!
}
```

---

## 🎯 What You'll Build Today

In today's challenges, you'll:

1. ✅ Build a `makeArray<T>` function
2. 📦 Create a generic `Box<T>` wrapper class
3. 🔄 Implement a type-safe `swap<A, B>` function
4. 📚 Build a generic collection class with methods
5. 🔥 **BOSS**: Create a fluent query builder with generics

---

## 🚀 Ready for the Challenge?

You now understand:

- ✅ Why generics exist (reusability + type safety)
- ✅ How to write generic functions
- ✅ How to use constraints
- ✅ When to use multiple type parameters
- ✅ Real-world patterns with generics

**Time to build!**

Head to [CHALLENGE.md](./CHALLENGE.md) and show me what you've got! 💪

---

<div align="center">

**"The Factory produces anything, but each product is perfectly crafted."** 🏭

[Next: Take the Challenge →](./CHALLENGE.md)

</div>
