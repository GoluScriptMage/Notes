// Type Definitions for Session 1 Challenge
//
// PROBLEM: These types are too loose and don't provide proper type safety
// YOUR MISSION: Rewrite them using discriminated unions

// 🚨 BROKEN TYPES BELOW - FIX THEM! 🚨

// This is too loose - it allows invalid combinations
export interface NetworkResponse {
  status: "loading" | "success" | "error";
  data?: UserData; // ❌ Should this always be optional?
  error?: ErrorInfo; // ❌ Should this always be optional?
  progress?: number; // ❌ When should this exist?
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  lastLogin: string; // ❌ Should this be Date? string?
  notifications: number;
  preferences?: UserPreferences; // This might cause issues...
}

export interface ErrorInfo {
  code: string;
  message: string;
  timestamp: string; // ❌ Should this be Date? string?
  details?: any; // ❌ 'any' is forbidden in this course!
}

export interface UserPreferences {
  theme: "light" | "dark";
  language: string; // ❌ Should this be more specific?
  emailNotifications: boolean;
}

// 💡 HINTS FOR FIXING:
//
// 1. NetworkResponse should be a DISCRIMINATED UNION, not a loose interface
//    - LoadingResponse should have status: 'loading' and optional progress
//    - SuccessResponse should have status: 'success' and required data
//    - ErrorResponse should have status: 'error' and required error
//
// 2. Make timestamps consistent - use Date objects or ISO strings, not both
//
// 3. Replace 'any' with proper types
//
// 4. Consider what properties are truly optional vs required
//
// 5. Make language more type-safe with literal types

// EXAMPLE OF WHAT YOU'RE AIMING FOR:
//
// export type NetworkResponse =
//   | LoadingResponse
//   | SuccessResponse
//   | ErrorResponse
//
// export interface LoadingResponse {
//   status: 'loading'
//   progress?: number  // Only loading responses have progress
// }
//
// export interface SuccessResponse {
//   status: 'success'
//   data: UserData     // Success responses always have data
// }
//
// export interface ErrorResponse {
//   status: 'error'
//   error: ErrorInfo   // Error responses always have error
// }
