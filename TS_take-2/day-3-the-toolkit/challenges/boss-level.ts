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

// TODO: Create PageConfig type using combination of utility types
// Hint: You can combine Pick, Omit, and Partial
// There are multiple solutions!

// Solution 1 approach: Pick required fields + make optional fields partial
// type PageConfig = ...

// Solution 2 approach: Omit unwanted + make some optional
// type PageConfig = ...

// Step 3: Write the createPage function
function createPage(config: PageConfig) {
  const defaults = {
    theme: "light" as const,
    layout: "list" as const,
  };

  const page = { ...defaults, ...config };
  console.log(
    `Creating page: ${page.title} at ${page.url} with theme: ${page.theme}, layout: ${page.layout}`
  );
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
