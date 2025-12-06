// SOLUTION: Fixed Types for Session 1
// This demonstrates the correct implementation of discriminated unions

// ✅ FIXED: Proper discriminated union instead of loose interface
export type NetworkResponse = LoadingResponse | SuccessResponse | ErrorResponse;

// Each response type has a unique 'status' discriminant
export interface LoadingResponse {
  status: "loading";
  progress?: number; // Only loading responses can have progress
}

export interface SuccessResponse {
  status: "success";
  data: UserData; // Success responses ALWAYS have data (required)
}

export interface ErrorResponse {
  status: "error";
  error: ErrorInfo; // Error responses ALWAYS have error info (required)
}

// ✅ FIXED: Consistent date handling and removed 'any' types
export interface UserData {
  id: string;
  name: string;
  email: string;
  lastLogin: Date; // ✅ Consistent Date type
  notifications: number;
  preferences?: UserPreferences; // Truly optional
}

export interface ErrorInfo {
  code: string;
  message: string;
  timestamp: Date; // ✅ Consistent Date type
  details?: ErrorDetails; // ✅ Removed 'any', added proper type
}

// ✅ NEW: Proper type for error details instead of 'any'
export interface ErrorDetails {
  requestId?: string;
  endpoint?: string;
  statusCode?: number;
  metadata?: Record<string, string | number | boolean>;
}

// ✅ FIXED: More specific language type
export interface UserPreferences {
  theme: "light" | "dark";
  language: "en" | "es" | "fr" | "de" | "zh"; // ✅ Specific languages instead of string
  emailNotifications: boolean;
}

// 💡 KEY LEARNINGS:

// 1. DISCRIMINATED UNIONS vs LOOSE INTERFACES
//    ❌ Bad: interface with optional properties that can create invalid states
//    interface BadResponse { status: string, data?: any, error?: any }
//
//    ✅ Good: Union of specific interfaces with discriminant property
//    type GoodResponse = LoadingResponse | SuccessResponse | ErrorResponse

// 2. REQUIRED vs OPTIONAL PROPERTIES
//    - Success responses ALWAYS have data (required)
//    - Error responses ALWAYS have error (required)
//    - Loading responses MAY have progress (optional)

// 3. TYPE CONSISTENCY
//    - All timestamps use Date type consistently
//    - No 'any' types - everything has proper shape
//    - Language is constrained to specific values

// 4. IMPOSSIBLE STATES MADE IMPOSSIBLE
//    - Can't have { status: 'success', error: ErrorInfo } ❌
//    - Can't have { status: 'error', data: UserData } ❌
//    - TypeScript prevents these at compile time! ✅
