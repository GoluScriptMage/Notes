// Session 1 Challenge: Fix the NetworkResponse Handler
//
// PROBLEM: This code looks correct but has subtle type issues that cause runtime crashes.
// YOUR MISSION: Fix it using discriminated unions, type guards, and exhaustive checking.
//
// RULES:
// - NO 'any' types allowed
// - Must handle all response states
// - Must be type-safe at compile time
// - Must be runtime-safe

import {
  NetworkResponse,
  UserData,
  ErrorInfo,
  type SuccessResponse,
} from "./types";

// 🚨 BROKEN CODE BELOW - FIX IT! 🚨

// This function crashes in production. Can you see why?
function processUserData(response: NetworkResponse): string {
  // This looks safe but isn't...
  if (response.status === "success") {
    // TypeScript thinks this is safe, but is it?
    return `Welcome ${response.data.name}! You have ${response.data.notifications} notifications.`;
  }

  if (response.status === "error") {
    // This also looks fine...
    return `Error: ${response.error.message} (Code: ${response.error.code})`;
  }

  // What happens if response.status is 'loading'?
  if (response.status === "loading") {
    return `Loading... ${response.progress || 0}% complete`;
  }

  const _exhaustiveCheck: never = response;
  return _exhaustiveCheck;
}

// This function has even more subtle bugs
function handleApiResponse(response: NetworkResponse): void {
  switch (response.status) {
    case "loading":
      console.log("Loading user data...");
      // Should we access response.progress here? It might exist...
      console.log(`Progress: ${response.progress || 0}%`);
      break;

    case "success":
      console.log("User loaded successfully!");
      // This looks safe...
      console.log(`User: ${response.data.name}`);
      console.log(`Email: ${response.data.email}`);
      console.log(
        `Last login: ${new Date(response.data.lastLogin).toLocaleDateString()}`
      );
      break;

    case "error":
      console.error("Failed to load user!");
      // This also looks safe...
      console.error(`Error: ${response.error.message}`);
      console.error(`Code: ${response.error.code}`);
      console.error(
        `Timestamp: ${new Date(response.error.timestamp).toLocaleDateString()}`
      );
      break;

    default: {
      const _exhaustiveCheck: never = response;
      return _exhaustiveCheck;
    }

    // What if a new status gets added to NetworkResponse?
    // How would you catch that at compile time?
  }
}

// This utility function has a sneaky bug
function isDataAvailable(
  response: NetworkResponse
): response is SuccessResponse {
  // This logic seems correct...
  return response.status === "success";
}

// This function tries to be smart but fails
function getDataOrThrow(response: NetworkResponse): UserData {
  if (isDataAvailable(response)) {
    // TypeScript should know response is SuccessResponse here, right?
    return response.data; // ❌ This might not compile!
  }
  throw new Error("Data not available");
}

// Advanced Challenge: This function should work but doesn't
function transformResponse<T>(
  response: NetworkResponse,
  transformer: (data: UserData) => T
): NetworkResponse | T {
  if (response.status === "success") {
    return transformer(response.data); // ❌ Type error here too!
  }
  return response;
}

// EXPORT THE FUNCTIONS YOU FIX
export {
  processUserData,
  handleApiResponse,
  isDataAvailable,
  getDataOrThrow,
  transformResponse,
};

// 💡 HINTS:
// 1. The type definitions in types.ts might be too loose
// 2. You need proper type guards that TypeScript can understand
// 3. The 'never' type can help catch missing cases
// 4. Look carefully at what properties exist on each response type
