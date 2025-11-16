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
var names = ["Alice", "Bob", "Charlie"];
var scores = [95, 87, 92];
var flags = [true, false, true]; // Alternative syntax
var flagss = [true, false, false];
// ❌ This would error:
// names.push(42); // Error: Argument of type 'number' is not assignable to parameter of type 'string'
// Tuples: Fixed-length arrays with specific types at each position
var person = ["Alice", 30]; // ✅ Must be [string, number]
// let invalid: [string, number] = [30, "Alice"]; // ❌ Error: types are in wrong order
// Tuples are great for functions that return multiple values:
function getCoordinates() {
    return [10, 20]; // Always returns exactly 2 numbers
}
var _a = getCoordinates(), x = _a[0], y = _a[1]; // Destructuring works perfectly!
console.log("X: ".concat(x, ", Y: ").concat(y));
function fetchData() {
    return [200, "Success"];
}
var _b = fetchData(), statuss = _b[0], message = _b[1];
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
function parseUser(input) {
    var parts = input.split(",");
    var isPremium = false;
    if (parts[2] === "true") {
        isPremium = true;
    }
    var username = parts[0];
    var age = Number(parts[1]);
    return [username, age, isPremium];
    // TODO: Convert parts to correct types and return as tuple
    // Hint: Use Number() and parts[2] === "true" for boolean conversion
}
// Test it:
var user = parseUser("alice_wonder,25,false");
console.log(user); // Should be ["alice_wonder", 25, false]
console.log(user[1] + 5); // Should be 30 (age + 5)
