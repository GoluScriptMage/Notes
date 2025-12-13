// 🟡 Challenge 3: The Role Map (The Record)
// Your task: Create a type-safe permission system

// Step 1: Define the UserRole union
type UserRole = "admin" | "editor" | "guest";

// Step 2: Create RolePermissions type using Record<K, T>
// TODO: type RolePermissions = Record<...>
// Should map UserRole to string[]

// Step 3: Create the permissions object
const permissions: RolePermissions = {
  // TODO: Fill in permissions for each role
  // admin: ["read", "write", "delete", "manage_users"],
  // editor: ["read", "write"],
  // guest: ["read"]
};

// Step 4: Write the permission checker function
function hasPermission(role: UserRole, action: string): boolean {
  // TODO: Check if role has the permission
  return false; // Replace this
}

// Step 5: Test it
console.log(hasPermission("admin", "delete")); // true
console.log(hasPermission("editor", "write")); // true
console.log(hasPermission("guest", "delete")); // false
console.log(hasPermission("guest", "read")); // true

// Expected output:
// true
// true
// false
// true

// Bonus: Try removing a role from permissions object
// TypeScript should give you an error!
