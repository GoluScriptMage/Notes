// ============================================
// 06: GENERICS
// ============================================

// ## The Concept:
// Generics are like "variables for types". Instead of writing separate functions
// for `getFirstString()`, `getFirstNumber()`, etc., you write ONE generic function
// that works with ANY type. Think of `<T>` as a placeholder that gets filled in
// when you call the function. It's TypeScript's way of making code reusable while
// staying type-safe.

// ## Code Example:

// ❌ Without generics (repetitive and not scalable):
function getFirstString(arr: string[]): string {
  return arr[0];
}

function getFirstNumber(arr: number[]): number {
  return arr[0];
}

// ✅ With generics (works for ANY type):
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

// TypeScript infers the type:
const firstNumber = getFirst([1, 2, 3]); // T is inferred as number
const firstName = getFirst(["Alice", "Bob"]); // T is inferred as string

// Or you can explicitly specify:
const firstValue = getFirst<number>([10, 20, 30]);

// ===== Generic with Multiple Type Parameters =====

function makePair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const pair1 = makePair("Alice", 30); // [string, number]
const pair2 = makePair(true, "active"); // [boolean, string]

// ===== Generic Interfaces =====

interface Box<T> {
  content: T;
}

const stringBox: Box<string> = { content: "Hello" };
const numberBox: Box<number> = { content: 42 };

// Generic with constraints (T must have certain properties):
interface HasLength {
  length: number;
}

function getLength<T extends HasLength>(item: T): number {
  return item.length; // Safe because T must have .length
}

getLength("hello"); // ✅ strings have .length
getLength([1, 2, 3]); // ✅ arrays have .length
// getLength(42); // ❌ Error: numbers don't have .length

// ===== Generic Classes =====

class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  getAll(): T[] {
    return this.data;
  }
}

const numberStore = new DataStore<number>();
numberStore.add(10);
numberStore.add(20);
console.log(numberStore.getAll()); // [10, 20]

const userStore = new DataStore<{ name: string }>();
userStore.add({ name: "Alice" });

// ===== Real-World Example: API Response Handler =====

interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

// This function can handle ANY type of API response:
function handleResponse<T>(response: ApiResponse<T>): T {
  if (response.status === 200) {
    return response.data;
  }
  throw new Error(response.message);
}

// Usage with different data types:
const userResponse: ApiResponse<{ id: number; name: string }> = {
  data: { id: 1, name: "Alice" },
  status: 200,
  message: "Success",
};

const user = handleResponse(userResponse); // Type is { id: number; name: string }
console.log(user.name); // ✅ TypeScript knows .name exists

// ============================================
// ## The Problem:
// ============================================
// Create a generic utility function called `wrapInArray` that takes a value of
// ANY type and returns an array containing that value.

// Requirements:
// - The function should work with strings, numbers, objects, etc.
// - The return type should be an array of the same type as the input
// - TypeScript should correctly infer the type

// ✏️ YOUR TASK:

// 1. Write the function signature with a generic type parameter <T>
// 2. Implement the function to return [value]
// 3. Test it with different types

// Starter code:
function wrapInArray(/* add generic parameter */) {
  // TODO: Return the value wrapped in an array
}

// Test cases (uncomment to test):
// const wrappedNumber = wrapInArray(42);
// console.log(wrappedNumber); // Should be [42], type: number[]

// const wrappedString = wrapInArray("hello");
// console.log(wrappedString); // Should be ["hello"], type: string[]

// const wrappedObject = wrapInArray({ name: "Alice", age: 30 });
// console.log(wrappedObject); // Should be [{ name: "Alice", age: 30 }], type: { name: string; age: number }[]

// ============================================
// BONUS CHALLENGE: Generic with Constraints
// ============================================

// Create a generic function `getProperty` that:
// - Takes an object and a key name
// - Returns the value of that property
// - Uses generics to maintain type safety

// Example usage:
// const user = { name: "Alice", age: 30, email: "alice@example.com" };
// const userName = getProperty(user, "name"); // Should return "Alice" with type string
// const userAge = getProperty(user, "age");   // Should return 30 with type number

// Hint: Use <T, K extends keyof T> to ensure the key exists in the object

// function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
//   return obj[key];
// }
