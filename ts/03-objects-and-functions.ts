// ============================================
// 03: OBJECTS AND FUNCTIONS
// ============================================

// ## The Concept:
// In JavaScript, objects are everywhere: { name: "Alice", age: 30 }. TypeScript
// lets you define the "shape" of an object - which properties it has and their types.
// For functions, you type the parameters AND the return value, making it clear
// what goes in and what comes out.

// ## Code Example:

// Typing function parameters and return values:
function add(a: number, b: number): number {
  return a + b;
}

// Optional parameters with ?
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

console.log(greet("Alice")); // "Hello, Alice!"
console.log(greet("Bob", "Hey")); // "Hey, Bob!"

// Typing objects inline:
function printUser(user: { name: string; age: number; email: string }): void {
  console.log(`${user.name} (${user.age}) - ${user.email}`);
}

printUser({ name: "Alice", age: 30, email: "alice@example.com" });

// Optional object properties:
function createPost(data: {
  title: string;
  content: string;
  published?: boolean;
}) {
  return {
    ...data,
    published: data.published ?? false, // Default to false if not provided
  };
}

// Readonly properties (can't be modified after creation):
function displayConfig(config: { readonly apiKey: string; timeout: number }) {
  // config.apiKey = "new-key"; // ❌ Error: Cannot assign to 'apiKey' because it is a read-only property
  console.log(`API Key: ${config.apiKey}, Timeout: ${config.timeout}ms`);
}

// Functions as object properties:
const calculator = {
  add: (a: number, b: number): number => a + b,
  multiply: (a: number, b: number): number => a * b,
};

console.log(calculator.add(5, 3)); // 8

// Arrow functions with types:
const square = (n: number): number => n * n;
const isEven = (n: number): boolean => n % 2 === 0;

// ============================================
// ## The Problem:
// ============================================
// You're building a user profile formatter. Create a function called `formatUserProfile`
// that takes a user object and returns a formatted string.

// The user object has:
// - name: string
// - age: number
// - email: string
// - isVerified: boolean (optional - defaults to false)

// The function should return a string like:
// "Alice (30) - alice@example.com [VERIFIED]"
// or
// "Bob (25) - bob@example.com [NOT VERIFIED]"

// ✏️ YOUR TASK:
// 1. Define the function with proper parameter types (inline object type)
// 2. Handle the optional `isVerified` property
// 3. Return the formatted string

// Starter code:
function formatUserProfile(/* add parameters here */) {
  // TODO: Build and return the formatted string
  // Hint: Use template literals and conditional logic for the verified status
}

// Test cases:
// console.log(formatUserProfile({ name: "Alice", age: 30, email: "alice@example.com", isVerified: true }));
// Expected: "Alice (30) - alice@example.com [VERIFIED]"

// console.log(formatUserProfile({ name: "Bob", age: 25, email: "bob@example.com" }));
// Expected: "Bob (25) - bob@example.com [NOT VERIFIED]"

// BONUS: Add a middle name property that's optional, and include it in the output if present
