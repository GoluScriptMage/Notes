# ⚙️ Tier 2: The Logic Core - MongoDB & Mongoose Mastery

> **"The database is your engine room. Learn to make it roar."**

---

## 🎯 Mission Objective

Master how to make your **database do the heavy lifting**. By the end of this tier, you'll understand:

- MongoDB/Mongoose schema design
- CRUD operations (Create, Read, Update, Delete)
- Advanced querying and filtering
- The legendary **ApiFeatures class** (Pagination, Sorting, Searching)

**This is where your backend becomes powerful and scalable.**

---

## 📚 Core Concepts

### 1. MongoDB & Mongoose - The "Funda"

**Analogy:** MongoDB is your **warehouse**. Mongoose is the **inventory system** that organizes everything.

- **MongoDB** → NoSQL database (stores data as JSON-like documents)
- **Mongoose** → ODM (Object Data Modeling) library that gives structure to MongoDB

#### Setting Up MongoDB Connection

**File: `config/db.js`**

```javascript
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1); // Exit if DB fails
  }
};
```

**File: `server.js`**

```javascript
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());

app.listen(5000, () => console.log("Server running on port 5000"));
```

**File: `.env`**

```
MONGO_URI=mongodb://localhost:27017/codesync
```

**🧠 Quick Test:** Why do we use `process.exit(1)` if the database connection fails?

<details>
<summary>Click to reveal answer</summary>

**Answer:** Because **the app shouldn't run without a database**!

If MongoDB connection fails, your app would crash anyway when trying to query data. Better to exit immediately with a clear error message than to let it run in a broken state.

`process.exit(1)` → Exits the Node.js process with an error code (1 = error, 0 = success).

</details>

---

### 2. Mongoose Schemas - Defining Your Data Structure

**Analogy:** A schema is like a **blueprint** for a table. It defines what fields exist and their types.

**File: `models/User.js`**

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true, // Removes extra spaces
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // No duplicate emails
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // Only these values allowed
      default: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

export default mongoose.model("User", userSchema);
```

**🧠 Quick Test:** What happens if you try to create a user without an email?

<details>
<summary>Click to reveal answer</summary>

**Answer:** Mongoose will **throw a validation error**:

```javascript
ValidationError: User validation failed: email: Email is required
```

Because we set `required: [true, 'Email is required']` in the schema!

</details>

---

### 3. CRUD Operations - The Four Pillars of Data

**File: `controllers/userController.js`**

#### **C - Create (POST)**

```javascript
import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const user = await User.create({ name, email, role });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### **R - Read (GET)**

```javascript
// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Find all
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### **U - Update (PUT/PATCH)**

```javascript
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run schema validations
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### **D - Delete (DELETE)**

```javascript
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**🧠 Quick Test:** What's the difference between `User.find()` and `User.findById()`?

<details>
<summary>Click to reveal answer</summary>

**Answer:**

- **`User.find()`** → Returns an **array** of all users that match the query (or empty array if none)

  ```javascript
  const users = await User.find({ role: "admin" }); // [user1, user2, ...]
  ```

- **`User.findById(id)`** → Returns a **single user object** or `null` if not found
  ```javascript
  const user = await User.findById("64a3b2c1d5e6f7g8h9i0j1k2"); // Single user or null
  ```

</details>

---

### 4. Advanced Querying - Making the Database Work Smart

#### **Filtering with Query Strings**

**Frontend Request:**

```
GET /api/users?role=admin
```

**Backend:**

```javascript
export const getUsers = async (req, res) => {
  try {
    // Build query from URL params
    const query = { ...req.query };

    const users = await User.find(query);
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### **Operators: Greater Than, Less Than**

**Frontend Request:**

```
GET /api/products?price[gte]=1000&price[lte]=5000
```

**Backend:**

```javascript
export const getProducts = async (req, res) => {
  try {
    // Convert { price: { gte: '1000' } } → { price: { $gte: 1000 } }
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const query = JSON.parse(queryStr);

    const products = await Product.find(query);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

### 5. The Legendary ApiFeatures Class

**This is the high-level pattern you learned before!** Let's rebuild it.

**File: `utils/apiFeatures.js`**

```javascript
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query object
    this.queryString = queryString; // req.query from Express
  }

  // 1. FILTERING
  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Advanced filtering (gte, lte, gt, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this; // Enable method chaining
  }

  // 2. SORTING
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt"); // Default: newest first
    }
    return this;
  }

  // 3. FIELD LIMITING (Select specific fields)
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v"); // Exclude __v by default
    }
    return this;
  }

  // 4. PAGINATION
  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
```

**Using ApiFeatures:**

```javascript
import ApiFeatures from "../utils/apiFeatures.js";

export const getProducts = async (req, res) => {
  try {
    const features = new ApiFeatures(Product.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const products = await features.query;

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**🧠 Quick Test:** What does this URL do?

```
GET /api/products?price[gte]=1000&sort=-price&page=2&limit=5
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

1. **Filter:** Products with `price >= 1000`
2. **Sort:** By price in descending order (`-price` means highest first)
3. **Paginate:** Show page 2, with 5 products per page (skip first 5, show next 5)

**Result:** You get products 6-10 (second page) that cost 1000 or more, sorted from most expensive to least expensive.

</details>

---

## 🔥 The CodeSync Logic Core Challenge

### **Your Mission: Build a Task Management API**

**Requirements:**

1. Create a `Task` model with:

   - `title` (required)
   - `description`
   - `status` (enum: 'todo', 'in-progress', 'done')
   - `priority` (enum: 'low', 'medium', 'high')
   - `createdAt`

2. Implement full CRUD operations

3. Add ApiFeatures support:
   - Filter by status: `/api/tasks?status=todo`
   - Sort by priority: `/api/tasks?sort=-priority`
   - Pagination: `/api/tasks?page=1&limit=10`

**Try it yourself!** Solution in **[Mission-Checklist.md](./Mission-Checklist.md)**.

---

## 🎓 Next Steps

Go to **[Practice-Questions.md](./Practice-Questions.md)** to test your Mongoose mastery!

**Boss, you're leveling up fast!** 💪⚙️
