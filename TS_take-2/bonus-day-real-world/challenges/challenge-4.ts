// 📊 Challenge 4: API Response Transformations
// Use Utility Types to create different views of user data

/**
 * YOUR TASK:
 * Transform a full database user into different views using utility types
 *
 * Create:
 * 1. PublicUser: Omit passwordHash, email, settings
 * 2. UserPreview: Only id, username, profile.avatar
 * 3. EditableProfile: Make profile.bio and settings Partial
 * 4. AdminView: Everything + lastLogin: Date
 */

// Full database user
interface DatabaseUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "moderator" | "user";
  profile: {
    avatar: string;
    bio: string;
    joinedAt: Date;
  };
  settings: {
    notifications: boolean;
    privacy: "public" | "private";
  };
}

// 1. Public view (hide sensitive data)
type PublicUser = Omit<DatabaseUser, "passwordHash" | "email" | "settings">;

// 2. Preview for lists (minimal data)
type UserPreview = Pick<DatabaseUser, "id" | "username"> & {
  avatar: string;
};

// 3. Editable fields for profile updates
type EditableProfile = {
  profile: {
    avatar: string;
    bio?: string;
    joinedAt: Date;
  };
  settings?: {
    notifications: boolean;
    privacy: "public" | "private";
  };
};

// 4. Admin view (everything + extra data)
type AdminView = DatabaseUser & {
  lastLogin: Date;
};

// Helper functions to transform data
function toPublicUser(user: DatabaseUser): PublicUser {
  const { passwordHash, email, settings, ...publicData } = user;
  return publicData;
}

function toUserPreview(user: DatabaseUser): UserPreview {
  return {
    id: user.id,
    username: user.username,
    avatar: user.profile.avatar,
  };
}

function toEditableProfile(user: DatabaseUser): EditableProfile {
  return {
    profile: user.profile,
    settings: user.settings,
  };
}

function toAdminView(user: DatabaseUser, lastLogin: Date): AdminView {
  return {
    ...user,
    lastLogin,
  };
}

// ✅ Test transformations!
function testTransformations() {
  const dbUser: DatabaseUser = {
    id: "user_123",
    username: "Alice",
    email: "alice@example.com",
    passwordHash: "hashed_password_abc123",
    role: "user",
    profile: {
      avatar: "avatar1.png",
      bio: "TypeScript enthusiast",
      joinedAt: new Date("2024-01-01"),
    },
    settings: {
      notifications: true,
      privacy: "public",
    },
  };

  console.log("🔓 Public User:");
  console.log(toPublicUser(dbUser));

  console.log("\n👤 User Preview:");
  console.log(toUserPreview(dbUser));

  console.log("\n✏️ Editable Profile:");
  console.log(toEditableProfile(dbUser));

  console.log("\n👮 Admin View:");
  console.log(toAdminView(dbUser, new Date()));
}

testTransformations();

console.log("\n✅ Challenge 4 Complete! Data transformations are type-safe.");

export { DatabaseUser, PublicUser, UserPreview, EditableProfile, AdminView };
