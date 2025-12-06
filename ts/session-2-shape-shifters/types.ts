// Type Definitions for Session 2 Challenge
//
// YOUR MISSION: Implement these generic types to power the API framework

// 🎯 IMPLEMENT THESE GENERIC TYPES

// Basic API Response wrapper - should work with any data type
export interface ApiResponse<TData = unknown> {
  // TODO: Add proper generic structure
  data: any; // ❌ Fix this
  status: any; // ❌ Fix this
  timestamp: any; // ❌ Fix this
  success: any; // ❌ Fix this
}

// Paginated response wrapper - should preserve data types
export interface PaginatedResponse<TItem = unknown> {
  // TODO: Implement pagination with generics
  data: any; // ❌ Should be TItem[]
  pagination: any; // ❌ Add proper pagination info
}

// Cache entry with expiration - should be type-safe
export interface CacheEntry<TValue = unknown> {
  // TODO: Add generic cache structure
  value: any; // ❌ Fix this
  expiry: any; // ❌ Add expiration logic
  key: any; // ❌ Add key management
}

// Query configuration - should constrain to object properties
export interface QueryConfig<TEntity = unknown> {
  // TODO: Use keyof and mapped types
  where?: any; // ❌ Should constrain to TEntity keys
  orderBy?: any; // ❌ Should constrain to TEntity keys
  select?: any; // ❌ Should constrain to TEntity keys
  limit?: number;
  offset?: number;
}

// Endpoint configuration - should infer request/response types
export interface EndpointConfig<TRequest = unknown, TResponse = unknown> {
  // TODO: Add proper generic endpoint structure
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  requestValidator?: any; // ❌ Add type-safe validation
  responseValidator?: any; // ❌ Add type-safe validation
}

// ADVANCED: Conditional types for smart API responses
export type ApiResult<T> = any; // ❌ Implement conditional logic

// ADVANCED: Mapped types for partial updates
export type UpdateRequest<T> = any; // ❌ Should make all fields optional

// ADVANCED: Pick specific fields for responses
export type SelectFields<T, K> = any; // ❌ Should pick only specified keys

// BRUTAL: Deep readonly for immutable responses
export type DeepReadonly<T> = any; // ❌ Implement recursive readonly

// BRUTAL: Extract array item types
export type ArrayItem<T> = any; // ❌ Should extract T from T[]

// Sample entity interfaces for testing
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  preferences: UserPreferences;
  roles: Role[];
}

export interface UserPreferences {
  theme: "light" | "dark";
  language: string;
  notifications: boolean;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  age: number;
  preferences?: Partial<UserPreferences>;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  age?: number;
  isActive?: boolean;
  preferences?: Partial<UserPreferences>;
}

// Error types for API responses
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// 💡 IMPLEMENTATION HINTS:
//
// 1. ApiResponse<TData> should wrap any data type:
//    interface ApiResponse<TData> {
//      data: TData
//      status: number
//      timestamp: string
//      success: boolean
//    }
//
// 2. PaginatedResponse<TItem> should handle arrays:
//    interface PaginatedResponse<TItem> {
//      data: TItem[]
//      pagination: PaginationInfo
//    }
//
// 3. Use conditional types for smart behavior:
//    type ApiResult<T> = T extends { error: infer E }
//      ? ApiError<E>
//      : ApiResponse<T>
//
// 4. Use keyof for property constraints:
//    type ValidFields<T> = keyof T
//    where?: Array<{ field: keyof T, operator: string, value: any }>
//
// 5. Use mapped types for transformations:
//    type Partial<T> = { [K in keyof T]?: T[K] }
//    type Pick<T, K extends keyof T> = { [P in K]: T[P] }

// ADVANCED PATTERNS TO MASTER:
//
// Recursive types:
// type DeepReadonly<T> = {
//   readonly [K in keyof T]: T[K] extends object
//     ? DeepReadonly<T[K]>
//     : T[K]
// }
//
// Template literal types:
// type EventName<T> = `${string & keyof T}Changed`
//
// Distributed conditional types:
// type NonNullable<T> = T extends null | undefined ? never : T
