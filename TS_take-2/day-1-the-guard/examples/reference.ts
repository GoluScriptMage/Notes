// 📚 Day 1 Reference Examples - Discriminated Unions & Type Narrowing
// Use these as reference while working on your challenges!

// ========================================
// Example 1: Basic Discriminated Union
// ========================================

type Circle = {
  kind: "circle";
  radius: number;
};

type Square = {
  kind: "square";
  sideLength: number;
};

type Shape = Circle | Square;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      // TypeScript knows: shape is Circle here
      return Math.PI * shape.radius ** 2;

    case "square":
      // TypeScript knows: shape is Square here
      return shape.sideLength ** 2;
  }
}

// Test it:
const myCircle: Shape = { kind: "circle", radius: 10 };
const mySquare: Shape = { kind: "square", sideLength: 5 };

console.log("Circle area:", getArea(myCircle)); // ~314.16
console.log("Square area:", getArea(mySquare)); // 25

// ========================================
// Example 2: API Response Pattern
// ========================================

type LoadingState = {
  status: "loading";
};

type SuccessState<T> = {
  status: "success";
  data: T;
};

type ErrorState = {
  status: "error";
  error: string;
};

type ApiResponse<T> = LoadingState | SuccessState<T> | ErrorState;

// Generic handler that works with any data type
function handleApiResponse<T>(response: ApiResponse<T>): string {
  switch (response.status) {
    case "loading":
      return "⏳ Loading...";

    case "success":
      return `✅ Data: ${JSON.stringify(response.data)}`;

    case "error":
      return `❌ Error: ${response.error}`;
  }
}

// Test with different data types:
type User = { name: string; age: number };

const userLoading: ApiResponse<User> = { status: "loading" };
const userSuccess: ApiResponse<User> = {
  status: "success",
  data: { name: "Alice", age: 30 },
};
const userError: ApiResponse<User> = {
  status: "error",
  error: "User not found",
};

console.log(handleApiResponse(userLoading));
console.log(handleApiResponse(userSuccess));
console.log(handleApiResponse(userError));

// ========================================
// Example 3: Payment Methods
// ========================================

type CreditCard = {
  type: "credit_card";
  cardNumber: string;
  cvv: string;
  expiryDate: string;
};

type PayPal = {
  type: "paypal";
  email: string;
};

type Cryptocurrency = {
  type: "crypto";
  walletAddress: string;
  currency: "BTC" | "ETH" | "USDT";
};

type PaymentMethod = CreditCard | PayPal | Cryptocurrency;

function processPayment(method: PaymentMethod, amount: number): string {
  switch (method.type) {
    case "credit_card":
      return `💳 Charging $${amount} to card ending in ${method.cardNumber.slice(
        -4
      )}`;

    case "paypal":
      return `🅿️ Sending $${amount} via PayPal to ${method.email}`;

    case "crypto":
      return `₿ Sending ${amount} ${
        method.currency
      } to ${method.walletAddress.slice(0, 10)}...`;
  }
}

// Test it:
const card: PaymentMethod = {
  type: "credit_card",
  cardNumber: "1234567890123456",
  cvv: "123",
  expiryDate: "12/25",
};

const paypal: PaymentMethod = {
  type: "paypal",
  email: "alice@example.com",
};

const crypto: PaymentMethod = {
  type: "crypto",
  walletAddress: "0x1234567890abcdef",
  currency: "ETH",
};

console.log(processPayment(card, 100));
console.log(processPayment(paypal, 50));
console.log(processPayment(crypto, 0.5));

// ========================================
// Example 4: Form Field Types
// ========================================

type TextField = {
  fieldType: "text";
  value: string;
  maxLength?: number;
};

type NumberField = {
  fieldType: "number";
  value: number;
  min?: number;
  max?: number;
};

type SelectField = {
  fieldType: "select";
  value: string;
  options: string[];
};

type DateField = {
  fieldType: "date";
  value: Date;
  minDate?: Date;
  maxDate?: Date;
};

type FormField = TextField | NumberField | SelectField | DateField;

function validateField(field: FormField): boolean {
  switch (field.fieldType) {
    case "text":
      if (field.maxLength && field.value.length > field.maxLength) {
        console.log(`❌ Text too long! Max: ${field.maxLength}`);
        return false;
      }
      return true;

    case "number":
      if (field.min !== undefined && field.value < field.min) {
        console.log(`❌ Number too small! Min: ${field.min}`);
        return false;
      }
      if (field.max !== undefined && field.value > field.max) {
        console.log(`❌ Number too large! Max: ${field.max}`);
        return false;
      }
      return true;

    case "select":
      if (!field.options.includes(field.value)) {
        console.log(
          `❌ Invalid option! Must be one of: ${field.options.join(", ")}`
        );
        return false;
      }
      return true;

    case "date":
      if (field.minDate && field.value < field.minDate) {
        console.log(`❌ Date too early!`);
        return false;
      }
      if (field.maxDate && field.value > field.maxDate) {
        console.log(`❌ Date too late!`);
        return false;
      }
      return true;
  }
}

// Test validation:
const nameField: FormField = {
  fieldType: "text",
  value: "Alice",
  maxLength: 10,
};

const ageField: FormField = {
  fieldType: "number",
  value: 25,
  min: 18,
  max: 100,
};

const countryField: FormField = {
  fieldType: "select",
  value: "USA",
  options: ["USA", "Canada", "Mexico"],
};

console.log("Name valid?", validateField(nameField));
console.log("Age valid?", validateField(ageField));
console.log("Country valid?", validateField(countryField));

// ========================================
// Example 5: Exhaustiveness Checking
// ========================================

type Animal =
  | { species: "dog"; bark: () => void }
  | { species: "cat"; meow: () => void }
  | { species: "bird"; chirp: () => void };

function makeSound(animal: Animal): void {
  switch (animal.species) {
    case "dog":
      animal.bark();
      return;

    case "cat":
      animal.meow();
      return;

    case "bird":
      animal.chirp();
      return;

    default:
      // This ensures we handle ALL cases
      const exhaustive: never = animal;
      throw new Error(`Unhandled animal: ${exhaustive}`);
  }
}

// If you add a new animal type later (e.g., 'fish'),
// TypeScript will error at the `const exhaustive: never = animal` line!

// Test it:
const dog: Animal = {
  species: "dog",
  bark: () => console.log("🐕 Woof!"),
};

const cat: Animal = {
  species: "cat",
  meow: () => console.log("🐱 Meow!"),
};

makeSound(dog);
makeSound(cat);

// ========================================
// Key Patterns You'll Use:
// ========================================

/*
1. DISCRIMINATOR PROPERTY
   - Usually named: type, kind, status, state, etc.
   - Must be a LITERAL TYPE ('loading', not string)
   - Same property name across all variants

2. SWITCH STATEMENT
   - Check the discriminator
   - TypeScript narrows the type in each case
   - Get auto-completion for variant-specific properties

3. EXHAUSTIVENESS CHECKING
   - Add a default case with `never` type
   - Forces you to handle all cases
   - Catches bugs when adding new variants

4. UNIQUE PROPERTIES
   - Each variant has its own unique data
   - No optional properties for "maybe this state has this"
   - Makes impossible states impossible

5. TYPE SAFETY
   - Can't access wrong properties
   - Can't create invalid combinations
   - Compiler catches mistakes before runtime
*/

console.log("\n✅ All examples ran successfully!");
console.log("👉 Now try the challenges in /challenges/");
