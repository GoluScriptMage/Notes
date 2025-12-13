// 🔥 NIGHTMARE MODE: The API Response Transformer (Ultra Hard!)
// Your task: Transform API responses with complex type manipulations

// Step 1: Define the backend API response type
interface ApiUser {
  _id: string; // MongoDB ID
  username: string;
  email: string;
  passwordHash: string; // NEVER send to frontend!
  role: "admin" | "editor" | "guest";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    lastLogin: Date;
    loginCount: number;
  };
}

// Step 2: Create FrontendUser type
// Requirements:
// - Remove: _id, passwordHash, metadata
// - Add: id (number type)
// - Keep: everything else

// TODO: Create FrontendUser type
// Hint: Use Omit to remove fields, then use & to add id
// type FrontendUser = Omit<ApiUser, ...> & { id: number };

// Step 3: Create UserPreview type
// Requirements:
// - Based on FrontendUser
// - Only include: id, username, isActive

// TODO: Create UserPreview type
// type UserPreview = Pick<FrontendUser, ...>;

// Step 4: Create AdminUserView type
// Requirements:
// - Based on FrontendUser
// - Add back the metadata field from ApiUser

// TODO: Create AdminUserView type
// Hint: Use Pick to get metadata from ApiUser, combine with FrontendUser
// type AdminUserView = FrontendUser & Pick<ApiUser, "metadata">;

// Step 5: Write transformation functions
function toFrontendUser(apiUser: ApiUser): FrontendUser {
  // TODO: Transform apiUser to FrontendUser
  // Remove _id, passwordHash, metadata
  // Add id field (you can use a simple hash or random number)

  return {
    // ... your implementation
  } as FrontendUser;
}

function toUserPreview(frontendUser: FrontendUser): UserPreview {
  // TODO: Extract only id, username, isActive

  return {
    // ... your implementation
  } as UserPreview;
}

function toAdminUserView(
  apiUser: ApiUser,
  frontendUser: FrontendUser
): AdminUserView {
  // TODO: Combine frontendUser with metadata from apiUser

  return {
    // ... your implementation
  } as AdminUserView;
}

// Step 6: Test with sample data
const apiResponse: ApiUser = {
  _id: "507f1f77bcf86cd799439011",
  username: "emma",
  email: "emma@example.com",
  passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz",
  role: "editor",
  isActive: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-12-13"),
  metadata: {
    lastLogin: new Date("2024-12-13"),
    loginCount: 42,
  },
};

console.log("=== Frontend User ===");
const frontendUser = toFrontendUser(apiResponse);
console.log(frontendUser);

console.log("\n=== User Preview ===");
const preview = toUserPreview(frontendUser);
console.log(preview);

console.log("\n=== Admin User View ===");
const adminView = toAdminUserView(apiResponse, frontendUser);
console.log(adminView);

// Expected output:
// === Frontend User ===
// {
//   username: 'emma',
//   email: 'emma@example.com',
//   role: 'editor',
//   isActive: true,
//   createdAt: ...,
//   updatedAt: ...,
//   id: (some number)
// }
//
// === User Preview ===
// { id: (number), username: 'emma', isActive: true }
//
// === Admin User View ===
// {
//   ... all FrontendUser fields ...
//   metadata: { lastLogin: ..., loginCount: 42 }
// }

// Success criteria:
// ✅ FrontendUser has no _id, passwordHash, or metadata
// ✅ FrontendUser has new id field
// ✅ UserPreview only has id, username, isActive
// ✅ AdminUserView has everything from FrontendUser + metadata
// ✅ All types are created using utility types (no manual field listing!)
