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
type FrontendUser = Omit<ApiUser, "_id" | "passwordHash" | "metadata"> & {
  id: number;
};

// Step 3: Create UserPreview type
type UserPreview = Pick<FrontendUser, "id" | "username" | "isActive">;

// Step 4: Create AdminUserView type
type AdminUserView = FrontendUser & Pick<ApiUser, "metadata">;

// Step 5: Write transformation functions

function toFrontendUser(apiUser: ApiUser): FrontendUser {
  const { _id, passwordHash, metadata, ...rest } = apiUser;

  return {
    ...rest,
    id: parseInt(_id.slice(-6), 16),
  };
}

function toUserPreview(frontendUser: FrontendUser): UserPreview {
  const { id, username, isActive } = frontendUser;
  return {
    id,
    username,
    isActive,
  };
}

function toAdminUserView(
  apiUser: ApiUser,
  frontendUser: FrontendUser
): AdminUserView {
  const { metadata } = apiUser;
  return {
    ...frontendUser,
    metadata,
  };
}

const apiResponse: ApiUser = {
  _id: "507f1f77bcf86cd799439011",
  username: "emma",
  email: "emma@example.com",
  passwordHash: "$2b$10$...",
  role: "editor",
  isActive: true,
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-12-13"),
  metadata: {
    lastLogin: new Date("2024-12-13"),
    loginCount: 42,
  },
};

const frontendUser = toFrontendUser(apiResponse);
console.log(frontendUser);

const preview = toUserPreview(frontendUser);
console.log(preview);

const adminView = toAdminUserView(apiResponse, frontendUser);
console.log(adminView);

// console.log("=== Frontend User ===");
// const frontendUser = toFrontendUser(apiResponse);
// console.log(frontendUser);

// console.log("\n=== User Preview ===");
// const preview = toUserPreview(frontendUser);
// console.log(preview);

// console.log("\n=== Admin User View ===");
// const adminView = toAdminUserView(apiResponse, frontendUser);
// console.log(adminView);

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
