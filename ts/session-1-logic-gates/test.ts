// Test Suite for Session 1 Challenge
//
// These tests will fail until you fix the types and functions.
// Run with: npx tsc --noEmit test.ts

import {
  processUserData,
  handleApiResponse,
  isDataAvailable,
  getDataOrThrow,
  transformResponse,
} from "./challenge";

import { NetworkResponse, UserData } from "./types";

// Test Data - These should represent your fixed types
const loadingResponse: NetworkResponse = {
  status: "loading",
  progress: 45,
};

const successResponse: NetworkResponse = {
  status: "success",
  data: {
    id: "123",
    name: "John Doe",
    email: "john@example.com",
    lastLogin: new Date().toISOString(),
    notifications: 5,
    preferences: {
      theme: "dark",
      language: "en",
      emailNotifications: true,
    },
  },
};

const errorResponse: NetworkResponse = {
  status: "error",
  error: {
    code: "USER_NOT_FOUND",
    message: "User with ID 123 does not exist",
    timestamp: new Date().toISOString(),
    details: {
      requestId: "req_456",
      endpoint: "/api/users/123",
    },
  },
};

// 🧪 TEST CASES

console.log("=== Testing processUserData ===");

// Should work without type errors
const result1 = processUserData(successResponse);
console.log("Success case:", result1);

const result2 = processUserData(errorResponse);
console.log("Error case:", result2);

const result3 = processUserData(loadingResponse);
console.log("Loading case:", result3);

console.log("=== Testing handleApiResponse ===");

// Should handle all cases without type errors
handleApiResponse(loadingResponse);
handleApiResponse(successResponse);
handleApiResponse(errorResponse);

console.log("=== Testing isDataAvailable ===");

// Should narrow types properly
console.log("Loading has data:", isDataAvailable(loadingResponse)); // false
console.log("Success has data:", isDataAvailable(successResponse)); // true
console.log("Error has data:", isDataAvailable(errorResponse)); // false

console.log("=== Testing getDataOrThrow ===");

try {
  const data1 = getDataOrThrow(successResponse); // Should work
  console.log("Got data:", data1.name);
} catch (e) {
  console.error("Unexpected error:", e);
}

try {
  const data2 = getDataOrThrow(errorResponse); // Should throw
  console.log("Should not reach here");
} catch (e) {
  console.log("Expected error for error response");
}

console.log("=== Testing transformResponse ===");

// Should transform success responses, pass through others
const doubled = transformResponse(successResponse, (data) => ({
  ...data,
  notifications: data.notifications * 2,
}));

console.log("Transformed response:", doubled);

const passedThrough = transformResponse(errorResponse, (data) => ({
  ...data,
  notifications: data.notifications * 2,
}));

console.log("Passed through response:", passedThrough);

// 🎯 ADVANCED TESTS

console.log("=== Advanced Type Safety Tests ===");

// These should cause compile-time errors if types aren't fixed:

// Test 1: Can't access wrong properties
// loadingResponse.data          // ❌ Should be type error
// successResponse.error         // ❌ Should be type error
// errorResponse.progress        // ❌ Should be type error

// Test 2: Exhaustive checking
function testExhaustive(response: NetworkResponse): string {
  switch (response.status) {
    case "loading":
      return "Loading...";
    case "success":
      return `Loaded ${response.data.name}`;
    case "error":
      return `Error: ${response.error.message}`;
    default:
      // This should cause a compile error if you add a new status
      // but forget to handle it
      const _exhaustiveCheck: never = response;
      return _exhaustiveCheck;
  }
}

console.log("Exhaustive test:", testExhaustive(successResponse));

console.log("✅ All tests completed!");

// 💡 SUCCESS CRITERIA:
// - This file compiles without any TypeScript errors
// - All console.log statements execute without runtime errors
// - IntelliSense shows correct types and properties
// - Accessing wrong properties shows compile-time errors
