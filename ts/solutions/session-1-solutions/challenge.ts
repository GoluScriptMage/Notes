// SOLUTION: Fixed Challenge Functions for Session 1
// This demonstrates proper type guards, narrowing, and exhaustive checking

import {
  NetworkResponse,
  SuccessResponse,
  ErrorResponse,
  LoadingResponse,
  UserData,
} from "./types";

// ✅ SOLUTION: Type-safe with proper narrowing
export function processUserData(response: NetworkResponse): string {
  // Use the discriminant to narrow types
  switch (response.status) {
    case "success":
      // TypeScript knows response is SuccessResponse here
      // response.data is guaranteed to exist and be UserData
      return `Welcome ${response.data.name}! You have ${response.data.notifications} notifications.`;

    case "error":
      // TypeScript knows response is ErrorResponse here
      // response.error is guaranteed to exist
      return `Error: ${response.error.message} (Code: ${response.error.code})`;

    case "loading":
      // TypeScript knows response is LoadingResponse here
      // Can safely access optional progress property
      const progress = response.progress ?? 0;
      return `Loading... ${progress}% complete`;

    default:
      // ✅ Exhaustive checking - will cause compile error if we add new status
      const _exhaustive: never = response;
      return _exhaustive;
  }
}

// ✅ SOLUTION: Proper exhaustive handling with never type
export function handleApiResponse(response: NetworkResponse): void {
  switch (response.status) {
    case "loading":
      console.log("Loading user data...");
      // Safe access to optional progress
      if (response.progress !== undefined) {
        console.log(`Progress: ${response.progress}%`);
      }
      break;

    case "success":
      console.log("User loaded successfully!");
      // All these properties are guaranteed to exist
      const { data } = response;
      console.log(`User: ${data.name}`);
      console.log(`Email: ${data.email}`);
      console.log(`Last login: ${data.lastLogin.toISOString()}`);
      break;

    case "error":
      console.error("Failed to load user!");
      // Error info is guaranteed to exist
      const { error } = response;
      console.error(`Error: ${error.message}`);
      console.error(`Code: ${error.code}`);
      console.error(`Timestamp: ${error.timestamp.toISOString()}`);
      break;

    default:
      // ✅ This will cause a compile error if we add a new status but forget to handle it
      const _exhaustive: never = response;
      console.error("Unhandled response type:", _exhaustive);
  }
}

// ✅ SOLUTION: Proper type guard that TypeScript understands
export function isDataAvailable(
  response: NetworkResponse
): response is SuccessResponse {
  return response.status === "success";
}

// ✅ SOLUTION: Uses type guard for proper narrowing
export function getDataOrThrow(response: NetworkResponse): UserData {
  if (isDataAvailable(response)) {
    // TypeScript now knows response is SuccessResponse
    return response.data; // ✅ This compiles perfectly!
  }
  throw new Error(`Data not available. Response status: ${response.status}`);
}

// ✅ SOLUTION: Proper generic constraints with type narrowing
export function transformResponse<T>(
  response: NetworkResponse,
  transformer: (data: UserData) => T
): T | NetworkResponse {
  if (response.status === "success") {
    // TypeScript knows response.data exists and is UserData
    return transformer(response.data);
  }
  // Return non-success responses as-is
  return response;
}

// ✅ ADDITIONAL: More advanced type guards
export function isLoadingResponse(
  response: NetworkResponse
): response is LoadingResponse {
  return response.status === "loading";
}

export function isErrorResponse(
  response: NetworkResponse
): response is ErrorResponse {
  return response.status === "error";
}

export function isSuccessResponse(
  response: NetworkResponse
): response is SuccessResponse {
  return response.status === "success";
}

// ✅ ADVANCED: Type-safe response handler with callbacks
export function handleResponseWithCallbacks<TResult>(
  response: NetworkResponse,
  handlers: {
    onLoading?: (response: LoadingResponse) => TResult;
    onSuccess?: (response: SuccessResponse) => TResult;
    onError?: (response: ErrorResponse) => TResult;
  }
): TResult | undefined {
  switch (response.status) {
    case "loading":
      return handlers.onLoading?.(response);
    case "success":
      return handlers.onSuccess?.(response);
    case "error":
      return handlers.onError?.(response);
    default:
      const _exhaustive: never = response;
      return _exhaustive;
  }
}

// ✅ MASTER: Conditional type for response mapping
type ResponseMapper<TResponse extends NetworkResponse> =
  TResponse extends LoadingResponse
    ? "loading"
    : TResponse extends SuccessResponse
    ? "success"
    : TResponse extends ErrorResponse
    ? "error"
    : never;

export function getResponseType<T extends NetworkResponse>(
  response: T
): ResponseMapper<T> {
  return response.status as ResponseMapper<T>;
}

export {
  processUserData,
  handleApiResponse,
  isDataAvailable,
  getDataOrThrow,
  transformResponse,
  isLoadingResponse,
  isErrorResponse,
  isSuccessResponse,
  handleResponseWithCallbacks,
  getResponseType,
};

// 💡 KEY SOLUTION PATTERNS:

// 1. DISCRIMINATED UNION NARROWING
//    - Use switch statements on the discriminant ('status')
//    - TypeScript automatically narrows the type in each case
//    - Access properties safely without optional chaining

// 2. TYPE GUARDS
//    - Functions that return 'value is Type'
//    - Must check the discriminant property
//    - Allows TypeScript to narrow types after the guard

// 3. EXHAUSTIVE CHECKING
//    - Use 'never' type in default case
//    - Forces compile error when new union members added
//    - Ensures all cases are handled

// 4. PROPER ERROR HANDLING
//    - Don't assume properties exist - use discriminants
//    - Throw meaningful errors with context
//    - Use type guards to avoid unsafe access

// 💻 ADVANCED PATTERNS DEMONSTRATED:

// - Generic constraints with type narrowing
// - Conditional types for response mapping
// - Callback-based handlers with proper typing
// - Multiple type guards for different use cases
