// ============================================
// 02: ARRAYS AND TUPLES
// ============================================

// ## The Concept:
// In JavaScript, arrays can hold anything: [1, "hello", true]. TypeScript lets you
// declare what types an array should contain. A **Tuple** is a special array with
// a *fixed length* and *specific types at each position* - like coordinates [x, y]
// where x and y are always numbers.

// ## Code Example:

// Regular typed arrays (all elements are the same type):
let names: string[] = ["Alice", "Bob", "Charlie"];
let scores: number[] = [95, 87, 92];
let flags: Array<boolean> = [true, false, true]; // Alternative syntax
let flagss: boolean[] = [true, false, false];

// ❌ This would error:
// names.push(42); // Error: Argument of type 'number' is not assignable to parameter of type 'string'

// Tuples: Fixed-length arrays with specific types at each position
let person: [string, number] = ["Alice", 30]; // ✅ Must be [string, number]
// let invalid: [string, number] = [30, "Alice"]; // ❌ Error: types are in wrong order

// Tuples are great for functions that return multiple values:
function getCoordinates(): [number, number] {
  return [10, 20]; // Always returns exactly 2 numbers
}

const [x, y] = getCoordinates(); // Destructuring works perfectly!
console.log(`X: ${x}, Y: ${y}`);

// Real-world use case: HTTP response with status and data
type ApiResponse = [number, string]; // [statusCode, message]
function fetchData(): ApiResponse {
  return [200, "Success"];
}

const [statuss, message] = fetchData();
if (statuss == 200) {
  console.log(message);
}

// ============================================
// ## The Problem:
// ============================================
// Create a function called `parseUser` that takes a comma-separated string
// like "john_doe,28,true" and returns a Tuple with:
// - Position 0: username (string)
// - Position 1: age (number)
// - Position 2: isPremium (boolean)

// Example input: "john_doe,28,true"
// Expected output: ["john_doe", 28, true]

// ✏️ YOUR TASK:
// 1. Define the return type as a Tuple (not just an array)
// 2. Parse the string and convert each part to the correct type
// 3. Test with: parseUser("alice_wonder,25,false")

// Starter code:
function parseUser(input: string): [string, number, boolean] {
  const parts = input.split(",");
  let isPremium: boolean = false;
  if (parts[2] === "true") {
    isPremium = true;
  }

  const username: string = parts[0];
  const age: number = Number(parts[1]);

  return [username, age, isPremium]
  // TODO: Convert parts to correct types and return as tuple
  // Hint: Use Number() and parts[2] === "true" for boolean conversion
}

// Test it:
const user = parseUser("alice_wonder,25,false");
console.log(user); // Should be ["alice_wonder", 25, false]
console.log(user[1] + 5); // Should be 30 (age + 5)
