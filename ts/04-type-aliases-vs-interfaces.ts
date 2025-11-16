// ============================================
// 04: TYPE ALIASES vs INTERFACES
// ============================================

// ## The Concept:
// Both `type` and `interface` let you name and reuse object shapes, but they have
// different strengths:
//
// **`type`**: More flexible - can represent primitives, unions, intersections, tuples.
//             Use for: utility types, unions, complex compositions.
//
// **`interface`**: Designed for objects. Can be extended and merged (declaration merging).
//                  Use for: Object shapes, especially public APIs and OOP patterns.
//
// Rule of thumb: Use `interface` for object shapes that might be extended.
//                Use `type` for everything else (unions, primitives, complex types).

// ## Code Example:

// ===== TYPE ALIASES =====

// Primitive types (interfaces can't do this):
type UserID = string | number; // Union type
type StatusCode = 200 | 404 | 500; // Literal union

let id: UserID = "user_123"; // ✅
id = 42; // ✅

// Object types with `type`:
type Point = {
  x: number;
  y: number;
};

const origin: Point = { x: 0, y: 0 };

// Unions and complex types:
type Response =
  | { success: true; data: string }
  | { success: false; error: string };

function handleResponse(res: Response) {
  if (res.success) {
    console.log(res.data); // TypeScript knows `data` exists here
  } else {
    console.log(res.error); // TypeScript knows `error` exists here
  }
}

// ===== INTERFACES =====

// Object shapes:
interface User {
  name: string;
  email: string;
}

// Extending interfaces (inheritance-like):
interface Admin extends User {
  role: "admin";
  permissions: string[];
}

const admin: Admin = {
  name: "Alice",
  email: "alice@admin.com",
  role: "admin",
  permissions: ["read", "write", "delete"],
};

// Declaration merging (adding properties later - unique to interfaces):
interface Window {
  customProperty: string;
}

interface Window {
  anotherProperty: number;
}

// Now Window has both properties!

// ===== WHEN TO USE WHICH =====

// ✅ Use TYPE for:
type Direction = "up" | "down" | "left" | "right"; // Unions
type Coordinate = [number, number]; // Tuples
type ID = string | number; // Primitive unions
type Callback = (data: string) => void; // Function types

// ✅ Use INTERFACE for:
interface Product {
  id: number;
  name: string;
  price: number;
}

interface ExtendedProduct extends Product {
  category: string;
} // When you need to extend

// Both work for objects, but interfaces are more conventional:
interface ButtonProps {
  // ← Common in React
  label: string;
  onClick: () => void;
}

// ============================================
// ## The Problem:
// ============================================
// You're building an e-commerce system. You need to model products with flexible IDs.

// ✏️ YOUR TASK:

// 1. Create a TYPE called `ProductID` that can be EITHER:
//    - A number (e.g., 12345)
//    - A string (e.g., "PROD-ABC-123")

// 2. Create an INTERFACE called `Product` with these properties:
//    - id: ProductID (use the type you just created)
//    - name: string
//    - price: number
//    - category: string
//    - inStock: boolean

// 3. Create an INTERFACE called `DigitalProduct` that EXTENDS `Product` and adds:
//    - downloadUrl: string
//    - fileSize: number (in MB)

// 4. Create two test objects:
//    - A physical product (type: Product)
//    - A digital product (type: DigitalProduct)

// Write your code below:

// type ProductID = ...

// interface Product { ... }

// interface DigitalProduct extends Product { ... }

// Test objects:
// const book: Product = {
//   id: 101,
//   name: "TypeScript Handbook",
//   price: 29.99,
//   category: "Books",
//   inStock: true,
// };

// const ebook: DigitalProduct = {
//   id: "EBOOK-TS-001",
//   name: "TypeScript Handbook (Digital)",
//   price: 19.99,
//   category: "Books",
//   inStock: true,
//   downloadUrl: "https://example.com/download/ts-handbook.pdf",
//   fileSize: 5.2,
// };

// console.log(book);
// console.log(ebook);

// BONUS: Why did we use `type` for ProductID instead of `interface`?
// Answer: Because...
