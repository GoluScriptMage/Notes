// 🔥 BOSS LEVEL: The Ultimate Config (Combo Challenge!)
// Your task: Combine multiple utility types to create the perfect config type

// Step 1: Define the base interface
interface PageSettings {
  title: string;
  url: string;
  theme: "light" | "dark";
  layout: "grid" | "list";
  showSidebar: boolean;
}

// Step 2: Create PageConfig type
// Requirements:
// - title and url are REQUIRED
// - theme and layout are OPTIONAL
// - showSidebar should NOT be included at all
type RequiredPageType = Pick<PageSettings, "title" | "url">;
type CreatePageConfig = RequiredPageType &
  Partial<Omit<PageSettings, "showSidebar" | "title" | "url">>;

// TODO: Create PageConfig type using combination of utility types
// Hint: You can combine Pick, Omit, and Partial
// There are multiple solutions!

// Step 3: Write the createPage function
function createPage(config: CreatePageConfig): void {
  console.log(`Creating page: ${config.title} at ${config.url} with theme: ${config.theme ?? "light"}, layout: ${config.layout ?? "list"}`);
}

// Step 4: Test with valid scenarios
createPage({
  title: "Home",
  url: "/home",
});

createPage({
  title: "About",
  url: "/about",
  theme: "dark",
});

createPage({
  title: "Contact",
  url: "/contact",
  theme: "light",
  layout: "grid",
});

// Step 5: Test invalid scenarios (uncomment to see TypeScript errors!)

// ❌ Missing required field
// createPage({ title: "Broken" });

// ❌ Has showSidebar (should be excluded)
// createPage({
//   title: "Bad",
//   url: "/bad",
//   showSidebar: true
// });

// Expected output:
// Creating page: Home at /home with theme: light, layout: list
// Creating page: About at /about with theme: dark, layout: list
// Creating page: Contact at /contact with theme: light, layout: grid
