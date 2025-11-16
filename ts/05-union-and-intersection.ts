// ============================================
// 05: UNION AND INTERSECTION TYPES
// ============================================

// ## The Concept:
// **Union Types (|)**: "OR" logic - a value can be one type OR another.
//                      Like saying "accept string OR number".
//
// **Intersection Types (&)**: "AND" logic - a value must satisfy ALL types.
//                             Like combining multiple object shapes into one.
//
// Think of unions as "flexible inputs" and intersections as "combined requirements".

// ## Code Example:

// ===== UNION TYPES (|) =====

// Basic union:
let id: string | number;
id = "user_123"; // ✅
id = 42; // ✅
// id = true; // ❌ Error

// Function with union parameter:
function printId(id: string | number): void {
  // Type narrowing: check which type it actually is
  if (typeof id === "string") {
    console.log(`String ID: ${id.toUpperCase()}`);
  } else {
    console.log(`Numeric ID: ${id.toFixed(0)}`);
  }
}

printId("abc123"); // "String ID: ABC123"
printId(42); // "Numeric ID: 42"

// Union of object types:
type SuccessResponse = {
  status: "success";
  data: string;
};

type ErrorResponse = {
  status: "error";
  message: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

function handleApiResponse(response: ApiResponse) {
  // Type narrowing with discriminated unions (the `status` field):
  if (response.status === "success") {
    console.log(`Data: ${response.data}`); // TypeScript knows `data` exists
  } else {
    console.log(`Error: ${response.message}`); // TypeScript knows `message` exists
  }
}

// Literal unions (specific values only):
type Theme = "light" | "dark" | "auto";
let currentTheme: Theme = "dark"; // ✅
// currentTheme = "blue"; // ❌ Error: Not one of the allowed values

// ===== INTERSECTION TYPES (&) =====

// Combining object types:
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

// Intersection: Must have ALL properties from both types
type EmployeePerson = Person & Employee;

const john: EmployeePerson = {
  name: "John",
  age: 30,
  employeeId: 12345,
  department: "Engineering",
}; // ✅ Has all required properties

// Practical use case: Adding timestamps to any type
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Post = {
  title: string;
  content: string;
};

type TimestampedPost = Post & Timestamped;

const blogPost: TimestampedPost = {
  title: "TypeScript Tips",
  content: "...",
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mixins pattern with intersections:
type Draggable = { drag: () => void };
type Resizable = { resize: () => void };
type UIElement = Draggable & Resizable & { render: () => void };

const panel: UIElement = {
  drag: () => console.log("Dragging..."),
  resize: () => console.log("Resizing..."),
  render: () => console.log("Rendering..."),
};

// ===== UNIONS vs INTERSECTIONS =====

// Union: "This OR that" (value can be one of the types)
type StringOrNumber = string | number; // Can be string OR number

// Intersection: "This AND that" (value must satisfy all types)
type StringAndNumber = string & number; // ⚠️ Impossible! Results in `never`

// ============================================
// ## The Problem:
// ============================================
// Create a flexible `formatValue` function that can handle different input types
// and behave differently based on what it receives.

// ✏️ YOUR TASK:

// 1. Create a function called `formatValue` that accepts a parameter of type
//    `string | number | boolean`

// 2. The function should return a string formatted as follows:
//    - If input is a string: return it wrapped in quotes: `"hello"` → `'"hello"'`
//    - If input is a number: return it with 2 decimal places: `42` → `'42.00'`
//    - If input is a boolean: return "YES" or "NO": `true` → `'YES'`

// 3. Use type narrowing (typeof checks) to handle each case

// Starter code:
function formatValue(value: /* add union type here */) {
  // TODO: Implement type narrowing and formatting logic
  // Hint: Use `typeof value === "string"`, etc.
}

// Test cases:
// console.log(formatValue("hello"));      // Should output: '"hello"'
// console.log(formatValue(42));           // Should output: '42.00'
// console.log(formatValue(3.14159));      // Should output: '3.14'
// console.log(formatValue(true));         // Should output: 'YES'
// console.log(formatValue(false));        // Should output: 'NO'

// ============================================
// BONUS CHALLENGE: Intersection Types
// ============================================

// Create a type called `AdminUser` that combines these three types using intersections:

type BaseUser = {
  id: number;
  username: string;
};

type ContactInfo = {
  email: string;
  phone: string;
};

type AdminRights = {
  canDelete: boolean;
  canBan: boolean;
};

// type AdminUser = ... (combine all three with &)

// Then create an admin user object:
// const admin: AdminUser = { ... };
