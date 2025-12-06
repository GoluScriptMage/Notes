# 🏭 Day 2: The Factory - CHALLENGE

## Your Mission 🎯

Yesterday you guarded against multiple states. Today, you're building **reusable, type-safe abstractions** with generics!

**Remember**: Try each challenge without peeking at solutions. The struggle makes you stronger! 💪

---

## 🟢 Challenge 1: The Array Wrapper (Warm-Up)

### The Scenario

You need a function that takes ANY single item and wraps it in an array. Simple, right? But it needs to preserve the type!

### Your Task

Write a generic function `makeArray<T>` that:

1. Takes a single parameter of any type `T`
2. Returns an array containing that single item `T[]`
3. TypeScript should infer the correct array type

### Expected Behavior

```typescript
const numbers = makeArray(42); // number[]
const strings = makeArray("hello"); // string[]
const booleans = makeArray(true); // boolean[]
const objects = makeArray({ name: "Alice" }); // { name: string }[]

console.log(numbers); // [42]
console.log(strings); // ["hello"]
```

### Write Your Code Here

👉 File: `challenges/challenge-1.ts`

<details>
<summary>💡 Hint (Click if stuck)</summary>

The function signature should look like:

```typescript
function makeArray<T>(item: T): T[] {
  // Your code here
}
```

You just need to return an array with the item inside!

</details>

---

## 🟡 Challenge 2: The Magic Box

### The Scenario

Create a reusable `Box<T>` class that can store any value and provide useful operations on it.

### Your Task

Create a class `Box<T>` with:

1. A private `value` property of type `T`
2. A constructor that takes an initial value
3. A `getValue()` method that returns the value
4. A `setValue(newValue: T)` method that updates the value
5. A `map<U>(fn: (value: T) => U): Box<U>` method that transforms the value and returns a new box

### Expected Behavior

```typescript
const numberBox = new Box(42);
console.log(numberBox.getValue()); // 42

numberBox.setValue(100);
console.log(numberBox.getValue()); // 100

const stringBox = numberBox.map((n) => n.toString());
console.log(stringBox.getValue()); // "100"

const lengthBox = stringBox.map((s) => s.length);
console.log(lengthBox.getValue()); // 3
```

### Write Your Code Here

👉 File: `challenges/challenge-2.ts`

<details>
<summary>💡 Hint (Click if stuck)</summary>

The `map` method should:

1. Apply the function to the current value
2. Create a NEW box with the transformed value
3. The new box's type (`U`) can be different from the current type (`T`)

```typescript
map<U>(fn: (value: T) => U): Box<U> {
  return new Box(fn(this.value))
}
```

</details>

---

## 🟡 Challenge 3: Type-Safe Pair Swapper

### The Scenario

You need a function that swaps the two elements in a tuple while preserving their types.

### Your Task

Write a generic function `swap<A, B>` that:

1. Takes a tuple `[A, B]` as input
2. Returns a new tuple `[B, A]` with elements swapped
3. Preserves the exact types of both elements

### Expected Behavior

```typescript
const pair1 = swap(["hello", 42]); // [42, "hello"] - [number, string]
const pair2 = swap([true, "yes"]); // ["yes", true] - [string, boolean]
const pair3 = swap([{ a: 1 }, [1, 2]]); // [[1, 2], { a: 1 }]

console.log(pair1); // [42, "hello"]
console.log(pair2); // ["yes", true]
```

### Write Your Code Here

👉 File: `challenges/challenge-3.ts`

<details>
<summary>💡 Hint (Click if stuck)</summary>

You need TWO type parameters since the types can be different!

```typescript
function swap<A, B>(pair: [A, B]): [B, A] {
  // Your code here
}
```

Array destructuring makes this easy: `const [first, second] = pair`

</details>

---

## 🔴 Challenge 4: Generic Collection (Boss Fight)

### The Scenario

Build a reusable `Collection<T>` class that works like an enhanced array with type safety.

### Your Task

Create a class `Collection<T>` with:

1. A private `items` array of type `T[]`
2. A constructor that accepts an initial array (optional)
3. `add(item: T): void` - adds an item
4. `remove(item: T): void` - removes first occurrence
5. `find(predicate: (item: T) => boolean): T | undefined` - finds an item
6. `filter(predicate: (item: T) => boolean): Collection<T>` - returns new collection
7. `map<U>(fn: (item: T) => U): Collection<U>` - transforms to new collection
8. `toArray(): T[]` - returns copy of internal array
9. `size(): number` - returns number of items

### Expected Behavior

```typescript
const numbers = new Collection([1, 2, 3, 4, 5]);

numbers.add(6);
console.log(numbers.size()); // 6

const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens.toArray()); // [2, 4, 6]

const strings = numbers.map((n) => n.toString());
console.log(strings.toArray()); // ["1", "2", "3", "4", "5", "6"]

const found = numbers.find((n) => n > 3);
console.log(found); // 4

numbers.remove(3);
console.log(numbers.toArray()); // [1, 2, 4, 5, 6]
```

### Write Your Code Here

👉 File: `challenges/challenge-4.ts`

<details>
<summary>💡 Hint (Click if stuck)</summary>

Structure your class like this:

```typescript
class Collection<T> {
  private items: T[];

  constructor(initial: T[] = []) {
    this.items = [...initial]; // Copy the array
  }

  add(item: T): void {
    // Add to items
  }

  filter(predicate: (item: T) => boolean): Collection<T> {
    // Return new Collection with filtered items
    return new Collection(this.items.filter(predicate));
  }

  // ... implement the rest
}
```

</details>

---

## 🔥 BONUS: Fluent Query Builder (Nightmare Mode)

### The Scenario

Build a type-safe query builder that chains methods fluently and tracks the query type.

### Your Task

Create a class `QueryBuilder<T>` that:

1. Starts with a `where<K extends keyof T>(key: K, value: T[K])` method
2. Supports chaining multiple `where` calls
3. Has a `select<K extends keyof T>(...keys: K[])` method that changes the result type
4. Has an `execute()` method that returns the appropriate result type
5. Everything should be type-safe and provide auto-completion

### Expected Behavior

```typescript
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Alice", age: 30, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 25, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 30, email: "charlie@example.com" },
];

// Full objects
const query1 = new QueryBuilder(users).where("age", 30).execute();
// Result: User[]

// Selected fields only
const query2 = new QueryBuilder(users)
  .where("age", 30)
  .select("name", "email")
  .execute();
// Result: { name: string; email: string }[]

// Chaining multiple where clauses
const query3 = new QueryBuilder(users)
  .where("age", 30)
  .where("name", "Alice")
  .execute();
// Result: User[]
```

### Write Your Code Here

👉 File: `challenges/bonus.ts`

<details>
<summary>💡 Hint (Click if stuck)</summary>

This is HARD! You'll need:

1. The class to track both the original type `T` and selected type
2. The `select` method to return a NEW `QueryBuilder` with different type
3. Generic type magic: `Pick<T, K>`

```typescript
class QueryBuilder<T, TResult = T> {
  private filters: Array<(item: T) => boolean> = [];
  private selectedKeys?: (keyof T)[];

  constructor(private data: T[]) {}

  where<K extends keyof T>(key: K, value: T[K]): QueryBuilder<T, TResult> {
    this.filters.push((item) => item[key] === value);
    return this;
  }

  select<K extends keyof T>(...keys: K[]): QueryBuilder<T, Pick<T, K>> {
    // Create new builder with Pick<T, K> as result type
    // ...
  }

  execute(): TResult[] {
    let result = this.data;

    // Apply filters
    for (const filter of this.filters) {
      result = result.filter(filter);
    }

    // Apply selection if any
    if (this.selectedKeys) {
      // Transform to pick only selected keys
    }

    return result as TResult[];
  }
}
```

</details>

---

## ✅ Completion Checklist

Before checking solutions:

- [ ] All code compiles without TypeScript errors
- [ ] You used generics (`<T>`, `<A, B>`, etc.)
- [ ] TypeScript infers types correctly (hover to check!)
- [ ] You get auto-completion in your IDE
- [ ] You tested with the example inputs
- [ ] You struggled for at least 15 minutes per challenge

---

## 🎯 What You're Learning

By completing these challenges, you're mastering:

✅ **Generic function syntax**  
✅ **Generic classes**  
✅ **Multiple type parameters**  
✅ **Type transformations (`map` pattern)**  
✅ **Constraints and bounds**  
✅ **Real-world reusable patterns**

---

## 🚀 Done? Check Your Work!

Once you've attempted ALL challenges:

👉 [SOLUTION.md](./SOLUTION.md) to see the answers

**Remember**: Different implementations are OK! What matters:

- Compiles without errors
- Uses generics properly
- Types are inferred correctly

---

## 📊 Track Your Progress

Update your achievements:

- [ ] Completed Challenge 1 (Warm-Up)
- [ ] Completed Challenge 2 (Magic Box)
- [ ] Completed Challenge 3 (Pair Swapper)
- [ ] Completed Challenge 4 (Boss Fight)
- [ ] Attempted Bonus Challenge (Nightmare Mode)

Add to [../../ACHIEVEMENTS.md](../../ACHIEVEMENTS.md)!

---

<div align="center">

### 🏭 "The Factory never stops. Neither should your creativity." 🏭

**Good luck, Builder!** May your types be generic and your code be reusable! 🎯

</div>
