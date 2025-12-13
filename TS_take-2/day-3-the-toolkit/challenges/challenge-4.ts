// 🔴 Challenge 4: The Selective Picker (Pick Practice)
// Your task: Use Pick to create specific subsets

// Step 1: Define the User interface
// TODO: Create interface User with:
// - id: number
// - username: string
// - email: string
// - age: number
// - bio: string
// - role: string

// Step 2: Create LoginCredentials using Pick<T, K>
// TODO: type LoginCredentials = Pick<...>
// Only include: id and email

// Step 3: Create UserCard using Pick<T, K>
// TODO: type UserCard = Pick<...>
// Only include: username and bio

// Step 4: Write the functions
function login(credentials: LoginCredentials) {
  console.log(
    `Logging in user ${credentials.id} with email: ${credentials.email}`
  );
}

function renderUserCard(card: UserCard) {
  console.log(`Rendering card for: ${card.username} - ${card.bio}`);
}

// Step 5: Test it
const creds: LoginCredentials = { id: 5, email: "test@example.com" };
login(creds);

const card: UserCard = { username: "diana", bio: "Design enthusiast" };
renderUserCard(card);

// Challenge: Try adding extra fields - TypeScript should error!
// const badCreds: LoginCredentials = {
//   id: 1,
//   email: "test@test.com",
//   username: "extra"  // ❌ Should error
// };

// Expected output:
// Logging in user 5 with email: test@example.com
// Rendering card for: diana - Design enthusiast
