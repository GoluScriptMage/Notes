// 🟡 Challenge 2: The Privacy Filter (The Filter)
// Your task: Hide sensitive information using Omit
   
// Step 1: Define the User interface (with role added)
// TODO: Create interface User with:
// - id: number
// - username: string
// - email: string
// - age: number
// - bio: string
// - role: string

type Role = "admin" | "employee" | "user";

interface User {
  id: number;
  username: string;
  email: string;
  age: number;
  bio: string;
  role: Role;
}

// Step 2: Create PublicProfile type using Omit<T, K>
// TODO: type PublicProfile = Omit<...>
// Remove: id and role
type PublicProfile = Omit<User, "id" | "role">;

// Step 3: Write the display function
const displayPublicProfile = (user: PublicProfile): void => {
  console.log(`Public Profile of User ${user.username}: ${JSON.stringify(user)}`);
};

// Step 4: Test it
const publicUser: PublicProfile = {
  username: "charlie",
  email: "charlie@example.com",
  age: 28,
  bio: "Full-stack developer",
};

displayPublicProfile(publicUser);

// Expected output:
// Public Profile:
// Username: charlie
// Email: charlie@example.com
// Age: 28
// Bio: Full-stack developer

////// Extra challenges
// Create a type that makes EVERYTHING readonly, including nested objects

interface User {
  id: number;
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  preferences: {
    theme: "light" | "dark";
    notifications: {
      email: boolean;
      sms: boolean;
    };
  };
}

// Challenge: Create DeepReadonly<T> that makes ALL properties readonly
// Including nested objects!

type DeepReadonly<T> = Readonly<T>;

type ReadonlyUser = DeepReadonly<User>;

// Should prevent ALL mutations:
const user: ReadonlyUser = { /* ... */ };
// user.name = "Bob";  // ❌ Error
// user.address.city = "NYC";  // ❌ Error (nested!)
// user.preferences.notifications.email = true;  // ❌ Error (deeply nested!)