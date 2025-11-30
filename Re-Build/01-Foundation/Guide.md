# 🏗️ Tier 1: The Foundation - Node.js & Express Mastery

> **"A skyscraper needs a concrete slab. Let's pour yours."**

---

## 🎯 Mission Objective

Master the **absolute basics** of how the frontend and backend communicate. By the end of this tier, you'll understand:

- How a Node.js/Express server works
- How to structure a professional backend
- How REST APIs actually talk to the frontend

**This is not boring theory. This is rebuilding your foundation with questions and clarity.**

---

## 📚 Core Concepts

### 1. **Node.js Server Setup - The "Funda"**

**Analogy:** Think of Node.js as the **building's foundation**. Express is the **blueprint** that organizes rooms (routes), doors (middleware), and the electricity (requests/responses).

#### The Basics You Already Know (But Let's Refresh):

```javascript
// server.js - The heart of your backend
import express from "express";

const app = express();
const PORT = 5000;

// Middleware - The "Gatekeeper"
app.use(express.json()); // Allows server to read JSON from frontend

// A simple route
app.get("/api/test", (req, res) => {
  res.status(200).json({ message: "Server is alive!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**🧠 Quick Test:** What does `app.use(express.json())` actually do?

<details>
<summary>Click to reveal answer</summary>

It's **middleware** that parses incoming JSON data from the frontend's `fetch()` or `axios` calls and makes it available in `req.body`.

Without it, `req.body` would be `undefined`!

</details>

---

### 2. **ES Module Imports - Modern JavaScript**

You learned this before! ES Modules are the **modern way** to import/export code.

```javascript
// Old way (CommonJS)
const express = require("express");

// Modern way (ES Modules) ✅
import express from "express";
```

**⚙️ To enable ES Modules in Node.js:**

In your `package.json`:

```json
{
  "type": "module"
}
```

**🧠 Quick Test:** Why use ES Modules instead of `require()`?

<details>
<summary>Click to reveal answer</summary>

- **Cleaner syntax** (`import/export` vs `require/module.exports`)
- **Tree-shaking** - Bundles only the code you use
- **Future-proof** - It's the JavaScript standard
- **Works seamlessly with React** and modern tools
</details>

---

### 3. **File Structure - The "Funda" of Organization**

**Analogy:** Your backend is like a **hospital**. You need separate rooms for different tasks:

```
📁 backend/
├── 📄 server.js          (The main entrance - starts everything)
├── 📁 config/
│   └── 📄 db.js          (Database connection logic)
├── 📁 routes/
│   └── 📄 userRoutes.js  (All /api/users/* endpoints)
├── 📁 controllers/
│   └── 📄 userController.js (Business logic for user operations)
├── 📁 models/
│   └── 📄 User.js        (Mongoose schema for User)
└── 📁 middleware/
    └── 📄 authMiddleware.js (Check if user is logged in)
```

**Why this structure?**

- **`server.js`** → The boss. Starts the server, connects routes.
- **`routes/`** → Defines **what URLs exist** (like `/api/users`, `/api/posts`).
- **`controllers/`** → Defines **what happens** when you hit those URLs.
- **`models/`** → Defines **how data is structured** in the database.
- **`middleware/`** → Defines **security checks** before reaching controllers.

---

### 4. **REST Basics - The Language of APIs**

**REST = Representational State Transfer** (Fancy name for "how frontend and backend talk")

| **HTTP Method**     | **Purpose** | **Example**                               |
| ------------------- | ----------- | ----------------------------------------- |
| **GET**             | Fetch data  | `GET /api/users` → Get all users          |
| **POST**            | Create data | `POST /api/users` → Create a new user     |
| **PUT** / **PATCH** | Update data | `PUT /api/users/123` → Update user 123    |
| **DELETE**          | Delete data | `DELETE /api/users/123` → Delete user 123 |

#### Example: A Simple User Route

**File: `routes/userRoutes.js`**

```javascript
import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";

const router = express.Router();

// GET /api/users - Fetch all users
router.get("/", getUsers);

// POST /api/users - Create a new user
router.post("/", createUser);

export default router;
```

**File: `controllers/userController.js`**

```javascript
// GET /api/users
export const getUsers = (req, res) => {
  res.status(200).json({ message: "Fetching users..." });
};

// POST /api/users
export const createUser = (req, res) => {
  const { name, email } = req.body; // Data from frontend
  res.status(201).json({ message: "User created!", user: { name, email } });
};
```

**File: `server.js`**

```javascript
import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json());

// Connect the routes
app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
```

**🧠 Quick Test:** If frontend calls `POST /api/users`, which function runs?

<details>
<summary>Click to reveal answer</summary>

**Answer:** `createUser` in `userController.js`!

**Flow:**

1. Frontend → `POST /api/users` with JSON body
2. Express matches `/api/users` → Goes to `userRoutes.js`
3. `router.post('/', createUser)` → Calls `createUser` function
4. Function processes `req.body` and sends response
</details>

---

## 🔥 The CodeSync Foundation Challenge

### **Your First Mission: Build a Simple Task API**

**Requirements:**

1. Create a `/api/tasks` endpoint
2. Implement:
   - `GET /api/tasks` → Return a list of tasks (hardcoded array for now)
   - `POST /api/tasks` → Accept a task from frontend and return it

**Starter Code:**

**File: `routes/taskRoutes.js`**

```javascript
import express from "express";
import { getTasks, createTask } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);

export default router;
```

**Now YOU write `controllers/taskController.js`!**

<details>
<summary>Click to see solution</summary>

```javascript
// Temporary in-memory storage
let tasks = [
  { id: 1, title: "Learn Express", completed: false },
  { id: 2, title: "Build REST API", completed: false },
];

// GET /api/tasks
export const getTasks = (req, res) => {
  res.status(200).json({ success: true, data: tasks });
};

// POST /api/tasks
export const createTask = (req, res) => {
  const { title } = req.body;

  const newTask = {
    id: tasks.length + 1,
    title,
    completed: false,
  };

  tasks.push(newTask);

  res.status(201).json({ success: true, data: newTask });
};
```

</details>

---

## 🎓 Self-Test Questions

Go to **[Practice-Questions.md](./Practice-Questions.md)** to test your understanding!

---

## ✅ Mission Checklist

Go to **[Mission-Checklist.md](./Mission-Checklist.md)** to track your progress!

---

**Next Step:** Once you complete this tier, move to **[Tier 2: The Logic Core →](../02-Logic-Core/Guide.md)**

**You've got this, Golu!** 💪🔥
