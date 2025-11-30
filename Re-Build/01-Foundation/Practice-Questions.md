# 🧠 Tier 1: Practice Questions

> **"Don't just read. Test yourself. That's how pros learn."**

---

## Question 1: The Server Basics

**Q:** What's the difference between `app.use()` and `app.get()`?

<details>
<summary>Click to reveal answer</summary>

**Answer:**

- **`app.use()`** → Middleware that runs for **ALL requests** (or specific path if provided)

  - Example: `app.use(express.json())` → Runs for every incoming request
  - Example: `app.use('/api/users', userRoutes)` → Runs only for `/api/users/*` routes

- **`app.get()`** → Defines a route handler for **GET requests only**
  - Example: `app.get('/api/test', handler)` → Only responds to `GET /api/test`

**Key Difference:** `app.use()` is for **middleware** (runs before routes), `app.get()` is for **route handlers** (responds to specific HTTP methods).

</details>

---

## Question 2: The Request Object

**Q:** If the frontend sends this request:

```javascript
fetch("http://localhost:5000/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Golu", email: "golu@example.com" }),
});
```

How do you access `name` and `email` in the backend?

<details>
<summary>Click to reveal answer</summary>

**Answer:**

```javascript
export const createUser = (req, res) => {
  const { name, email } = req.body;
  console.log(name); // 'Golu'
  console.log(email); // 'golu@example.com'
};
```

**Important:** You MUST have `app.use(express.json())` middleware enabled, otherwise `req.body` will be `undefined`!

</details>

---

## Question 3: Route Parameters vs Query Strings

**Q:** What's the difference between these two routes?

1. `GET /api/users/123`
2. `GET /api/users?id=123`

How do you access the `123` in each case?

<details>
<summary>Click to reveal answer</summary>

**Answer:**

1. **Route Parameter** → `/api/users/:id`

   ```javascript
   router.get("/:id", (req, res) => {
     const userId = req.params.id; // '123'
   });
   ```

2. **Query String** → `/api/users`
   ```javascript
   router.get("/", (req, res) => {
     const userId = req.query.id; // '123'
   });
   ```

**When to use what?**

- **Route params** (`/users/123`) → For **required** identifiers (like user ID)
- **Query strings** (`/users?role=admin`) → For **optional** filters (like search, pagination)

</details>

---

## Question 4: Status Codes

**Q:** What's the difference between:

- `res.status(200)`
- `res.status(201)`
- `res.status(400)`
- `res.status(404)`
- `res.status(500)`

<details>
<summary>Click to reveal answer</summary>

**Answer:**

| Status Code | Meaning               | When to Use                                              |
| ----------- | --------------------- | -------------------------------------------------------- |
| **200**     | OK                    | Successfully fetched data (GET)                          |
| **201**     | Created               | Successfully created a resource (POST)                   |
| **400**     | Bad Request           | Client sent invalid data (missing fields, wrong format)  |
| **404**     | Not Found             | Resource doesn't exist (e.g., user not found)            |
| **500**     | Internal Server Error | Something broke on the server (catch block in try/catch) |

**Example:**

```javascript
// POST /api/users
export const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const user = await User.create({ name, email });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
```

</details>

---

## Question 5: Middleware Order Matters!

**Q:** What happens in this code? Will the route work?

```javascript
import express from "express";
const app = express();

app.post("/api/users", (req, res) => {
  console.log(req.body); // What prints here?
  res.json({ message: "User created" });
});

app.use(express.json()); // Middleware AFTER the route

app.listen(5000);
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**No, it won't work!** `req.body` will be `undefined`.

**Why?** Middleware runs in the **order you define it**. Since `express.json()` is placed AFTER the route, it never gets a chance to parse the JSON body.

**Correct Order:**

```javascript
app.use(express.json()); // ✅ Middleware FIRST

app.post("/api/users", (req, res) => {
  console.log(req.body); // ✅ Now it works!
  res.json({ message: "User created" });
});
```

**Rule:** Middleware that affects ALL routes (like `express.json()`, `cors()`) should be at the **TOP** of your server file.

</details>

---

## Question 6: The File Structure Question

**Q:** You have this structure:

```
📁 backend/
├── 📄 server.js
├── 📁 routes/
│   └── 📄 userRoutes.js
└── 📁 controllers/
    └── 📄 userController.js
```

Complete the missing code:

**File: `server.js`**

```javascript
import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

// YOUR CODE HERE: Connect userRoutes to /api/users

app.listen(5000);
```

**File: `routes/userRoutes.js`**

```javascript
import express from "express";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

// YOUR CODE HERE: Define a GET / route that calls getUsers

export default router;
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**`server.js`:**

```javascript
app.use("/api/users", userRoutes);
```

**`routes/userRoutes.js`:**

```javascript
router.get("/", getUsers);
```

**Result:** When you call `GET /api/users`, Express will:

1. Match `/api/users` → Go to `userRoutes`
2. Match `/` (root of `userRoutes`) → Call `getUsers`

</details>

---

## Question 7: Debugging a Common Error

**Q:** You start your server with `node server.js` and get this error:

```
SyntaxError: Cannot use import statement outside a module
```

What's missing?

<details>
<summary>Click to reveal answer</summary>

**Answer:**

You need to add `"type": "module"` in your `package.json`:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js"
  }
}
```

**Why?** By default, Node.js uses **CommonJS** (`require()`). To use modern **ES Modules** (`import/export`), you must explicitly enable it with `"type": "module"`.

</details>

---

## 🎯 Challenge Question: Build Your Own Route

**Task:** Create a `/api/products` endpoint with the following:

1. `GET /api/products` → Return an array of products (hardcoded)
2. `GET /api/products/:id` → Return a single product by ID
3. `POST /api/products` → Create a new product (accept `name`, `price` from req.body)

**Structure:**

- `routes/productRoutes.js`
- `controllers/productController.js`

Try it yourself first! Then check the solution in **[Mission-Checklist.md](./Mission-Checklist.md)**.

---

**Ready for the next tier?** → [Go to Tier 2: The Logic Core](../02-Logic-Core/Guide.md)

**Boss, you're crushing it!** 🔥💪
