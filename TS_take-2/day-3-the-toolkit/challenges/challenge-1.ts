// 🟢 Challenge 1: The Profile Update (Warm-Up)
// Your task: Create a User interface and allow partial updates

// Step 1: Define the User interface
// TODO: Create interface User with:
// - id: number
// - username: string
// - email: string
// - age: number
// - bio: string
interface User {
  id: number;
  username: string;
  email: string;
  age: number;
  bio: string;
}

// Step 2: Create UserUpdate type using Partial<T>
type UserUpdate = Partial<Omit<User, "id">>;
type UpdateFn = (userId: number, updates: UserUpdate) => void;

const updateUserProfile: UpdateFn = (userId, updates) => {
  console.log(`Updating User ${userId} with :${JSON.stringify(updates)}`);
};

updateUserProfile(1, { username: "alice123" });
updateUserProfile(2, { email: "bob@example.com", bio: "TypeScript lover" });
updateUserProfile(3, {}); // No updates

// Expected output:
// Updating user 1 with: { username: 'alice123' }
// Updating user 2 with: { email: 'bob@example.com', bio: 'TypeScript lover' }
// Updating user 3 with: {}
