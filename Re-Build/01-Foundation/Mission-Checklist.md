# ✅ Tier 1: Mission Checklist

> **"Track your wins. Every checkbox is proof you're getting stronger."**

---

## 🎯 Core Concepts Mastery

Check off each concept as you master it:

- [ ] **I understand what Node.js and Express are used for**
- [ ] **I can explain what middleware is and why `app.use(express.json())` is needed**
- [ ] **I know the difference between ES Modules (`import/export`) and CommonJS (`require`)**
- [ ] **I can structure a backend with `/routes`, `/controllers`, and `/models` folders**
- [ ] **I understand REST API basics (GET, POST, PUT, DELETE)**
- [ ] **I can access data from `req.body`, `req.params`, and `req.query`**
- [ ] **I know when to use different HTTP status codes (200, 201, 400, 404, 500)**

---

## 🔨 Practical Skills

- [ ] **I created a basic Express server that runs on a port**
- [ ] **I created a route file (`routes/`) and connected it to `server.js`**
- [ ] **I created a controller file (`controllers/`) with handler functions**
- [ ] **I tested my API with Postman or Thunder Client (or frontend fetch)**
- [ ] **I handled errors with try/catch and proper status codes**

---

## 🚀 CodeSync Foundation Challenge

- [ ] **I completed the Task API challenge:**
  - [ ] `GET /api/tasks` returns a list of tasks
  - [ ] `POST /api/tasks` creates a new task
  - [ ] I tested both endpoints successfully

---

## 🧠 Self-Assessment

Answer these honestly:

1. **Can you create a new route without looking at docs?**

   - [ ] Yes, confidently
   - [ ] Yes, but I need to double-check syntax
   - [ ] Not yet, I need more practice

2. **Can you explain the request-response flow to someone else?**

   - [ ] Yes, I can teach it
   - [ ] I understand it but might stumble explaining it
   - [ ] I need to review it again

3. **Can you debug common errors (like `req.body undefined` or import errors)?**
   - [ ] Yes, I know how to fix them
   - [ ] I can Google them and figure it out
   - [ ] I need help with this

---

## 🎯 Challenge Solution: Product Routes

If you completed the challenge in **Practice-Questions.md**, here's the solution:

**File: `routes/productRoutes.js`**

```javascript
import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);

export default router;
```

**File: `controllers/productController.js`**

```javascript
// Temporary in-memory storage
let products = [
  { id: 1, name: "Laptop", price: 50000 },
  { id: 2, name: "Phone", price: 30000 },
  { id: 3, name: "Headphones", price: 2000 },
];

// GET /api/products
export const getProducts = (req, res) => {
  res.status(200).json({ success: true, data: products });
};

// GET /api/products/:id
export const getProductById = (req, res) => {
  const { id } = req.params;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return res.status(404).json({ success: false, error: "Product not found" });
  }

  res.status(200).json({ success: true, data: product });
};

// POST /api/products
export const createProduct = (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res
      .status(400)
      .json({ success: false, error: "Name and price are required" });
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price,
  };

  products.push(newProduct);

  res.status(201).json({ success: true, data: newProduct });
};
```

**File: `server.js`**

```javascript
import express from "express";
import productRoutes from "./routes/productRoutes.js";

const app = express();
app.use(express.json());

app.use("/api/products", productRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
```

---

## 🏆 Tier 1 Completion Certificate

Once you've checked off **ALL** the boxes above, you've earned this:

```
╔══════════════════════════════════════════════╗
║                                              ║
║        🏆 TIER 1 MASTERY ACHIEVED 🏆         ║
║                                              ║
║         The Foundation is Rock Solid         ║
║                                              ║
║              Developer: Golu                 ║
║         Date: ___________________            ║
║                                              ║
╚══════════════════════════════════════════════╝
```

---

## 🚀 Ready for the Next Level?

**Congratulations, Golu!** You've rebuilt your Node.js/Express foundation. You understand how servers work, how routes connect to controllers, and how REST APIs communicate.

**Next Mission:** [Tier 2: The Logic Core →](../02-Logic-Core/Guide.md)

Now we add the **database** and learn how to make it do the heavy lifting with MongoDB, Mongoose, and the legendary **ApiFeatures class**.

**Boss, you're on fire!** 🔥💪
