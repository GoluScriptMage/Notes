// Real-World Usage Examples for Session 2
//
// These examples should work perfectly once you implement the generics
// Run with: npx tsc --noEmit examples.ts

import {
  ApiClient,
  wrapInArray,
  createApiResponse,
  ResponseCache,
  createPaginatedResponse,
  EndpointBuilder,
  QueryBuilder,
} from "./challenge";

import { User, CreateUserRequest, UpdateUserRequest, Role } from "./types";

// 🧪 REAL-WORLD USAGE TESTS

console.log("=== Type-Safe API Client ===");

const userApi = new ApiClient("https://api.example.com");

// Should infer return type as User
const user = await userApi.get<User>("/users/123");
console.log("User name:", user.name); // ✅ Should have full type safety
console.log("User email:", user.email); // ✅ IntelliSense should work

// Should validate request/response types
const newUser = await userApi.post<User, CreateUserRequest>("/users", {
  name: "Jane Doe",
  email: "jane@example.com",
  age: 28,
  preferences: {
    theme: "dark",
    language: "en",
    notifications: true,
  },
});

console.log("Created user:", newUser.id);

// Should enforce partial updates
const updatedUser = await userApi.put<User, UpdateUserRequest>("/users/123", {
  name: "Jane Smith", // ✅ Optional field
  age: 29, // ✅ Optional field
  // email not required in update
});

console.log("=== Type-Safe Array Wrapper ===");

// Should maintain type information
const userArray = wrapInArray(user);
console.log("First user in array:", userArray[0].name); // ✅ Should be type-safe

const roleArray = wrapInArray<Role>({
  id: "role_1",
  name: "Admin",
  permissions: ["read", "write", "delete"],
});

console.log("Role permissions:", roleArray[0].permissions);

console.log("=== Type-Safe Response Cache ===");

const userCache = new ResponseCache<User>();

// Should only accept User objects
userCache.set("user:123", user);

// Should return User | undefined
const cachedUser = userCache.get("user:123");
if (cachedUser) {
  console.log("Cached user name:", cachedUser.name); // ✅ Type-safe access
}

// Should enforce transformer function types
const transformedUser = userCache.getOrTransform("user:456", (input: null) => ({
  id: "456",
  name: "Default User",
  email: "default@example.com",
  age: 0,
  isActive: false,
  preferences: {
    theme: "light" as const,
    language: "en",
    notifications: false,
  },
  roles: [],
}));

console.log("Transformed user:", transformedUser.name);

console.log("=== Type-Safe Pagination ===");

const users: User[] = [user, newUser, updatedUser];

// Should preserve array item types
const paginatedUsers = createPaginatedResponse(users, 1, 2);
console.log("First paginated user:", paginatedUsers.data[0].name); // ✅ Type-safe

const roles: Role[] = roleArray;
const paginatedRoles = createPaginatedResponse(roles, 1, 10);
console.log("Paginated roles count:", paginatedRoles.pagination.total);

console.log("=== Advanced: Type-Safe Endpoint Builder ===");

const endpoints = new EndpointBuilder()
  .addEndpoint("getUser", {
    method: "GET" as const,
    path: "/users/:id",
    responseValidator: (data: unknown): data is User => {
      return typeof data === "object" && data !== null && "id" in data;
    },
  })
  .addEndpoint("createUser", {
    method: "POST" as const,
    path: "/users",
    requestValidator: (data: unknown): data is CreateUserRequest => {
      return typeof data === "object" && data !== null && "name" in data;
    },
    responseValidator: (data: unknown): data is User => {
      return typeof data === "object" && data !== null && "id" in data;
    },
  })
  .build();

// Should provide type-safe endpoint access
const getUserEndpoint = endpoints.getEndpoint("getUser");
console.log("Get user endpoint:", getUserEndpoint.method);

console.log("=== Master Level: Type-Safe Query Builder ===");

// Should constrain field names to User properties
const userQuery = new QueryBuilder<User>()
  .where("name", "eq", "Jane") // ✅ 'name' is valid User field
  .where("age", "gt", 25) // ✅ 'age' is valid User field
  .where("isActive", "eq", true) // ✅ 'isActive' is valid User field
  // .where('invalid', 'eq', 'test')  // ❌ Should be compile error
  .orderBy("name", "asc") // ✅ 'name' is valid for sorting
  .select("id", "name", "email") // ✅ Valid User fields only
  .build();

console.log("User query:", userQuery);

// Should work with different entity types
const roleQuery = new QueryBuilder<Role>()
  .where("name", "eq", "Admin") // ✅ 'name' is valid Role field
  .select("id", "name") // ✅ Valid Role fields
  .build();

console.log("Role query:", roleQuery);

// 🎯 ADVANCED TYPE CHECKING TESTS

// These should cause compile-time errors if generics aren't implemented correctly:

// Test 1: Wrong property access
// console.log(user.invalidProperty)     // ❌ Should be type error

// Test 2: Wrong cache type
// userCache.set('user:123', roleArray[0]) // ❌ Should be type error

// Test 3: Invalid query fields
// const badQuery = new QueryBuilder<User>()
//   .where('invalidField', 'eq', 'test') // ❌ Should be type error

// Test 4: Wrong endpoint type
// const wrongResponse = await userApi.get<Role>('/users/123') // ❌ Conceptually wrong

console.log("✅ All type-safe examples completed!");

// 💡 SUCCESS CRITERIA:
// - All API calls have correct return types
// - IntelliSense shows available properties
// - Wrong property access causes compile errors
// - Generic constraints prevent invalid operations
// - Type inference works without manual annotations
