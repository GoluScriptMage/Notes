// ============================================
// 01: BASIC TYPES
// ============================================
// ## The Concept:
// TypeScript adds static typing to JavaScript. Instead of discovering type errors
// at runtime (like when you try to call .toUpperCase() on a number), TypeScript
// catches them during development. Think of types as "contracts" that make your
// code more predictable and self-documenting.
// ## Code Example:
// ❌ JavaScript: This compiles but crashes at runtime
// function greet(name) {
//   return name.toUpperCase();
// }
// greet(42); // Runtime error!
// ✅ TypeScript: This won't even compile
function greet(name) {
    return name.toUpperCase();
}
// greet(42); // TypeScript Error: Argument of type 'number' is not assignable to parameter of type 'string'
// The six foundational types:
var username = "Alice"; // Text data
var age = 30; // Numbers (int and float)
var isActive = true; // true/false
var randomValue = "could be anything"; // ⚠️ Disables type checking (avoid!)
var userInput = "safer than any"; // Must be checked before use
function logMessage(msg) {
    // Function returns nothing
    console.log(msg);
}
// 'unknown' is safer than 'any' - you must verify the type first:
if (typeof userInput === "string") {
    console.log(userInput.toUpperCase()); // ✅ Now it's safe
}
// ============================================
// ## The Problem:
// ============================================
// The function below has incorrect types. Fix all the type annotations
// so that TypeScript doesn't complain.
// Current (broken) code:
function calculateDiscount(price, discountPercent) {
    var discount = price * (discountPercent / 100);
    return price - discount;
}
// Test it:
var finalPrice = calculateDiscount(100, 15);
console.log("Final price: $".concat(finalPrice));
// ✏️ YOUR TASK:
// 1. Fix the parameter types (what should price and discountPercent actually be?)
// 2. Fix the return type (what does this function actually return?)
// 3. Uncomment the test code and make sure it runs without errors
// Write your corrected function below:
// function calculateDiscount(...) { ... }
