# ✅ Tier 2: Mission Checklist

> **"The database is your engine. Make it roar."**

---

## 🎯 Core Concepts Mastery

- [ ] **I understand what MongoDB and Mongoose are**
- [ ] **I can explain what a schema is and why we need it**
- [ ] **I know how to connect to MongoDB using Mongoose**
- [ ] **I can perform all CRUD operations (Create, Read, Update, Delete)**
- [ ] **I understand query operators ($gte, $lte, $in, $regex, etc.)**
- [ ] **I can use `populate()` to fetch related documents**
- [ ] **I understand the ApiFeatures pattern for pagination, sorting, and filtering**

---

## 🔨 Practical Skills

- [ ] **I created a Mongoose schema with validation rules**
- [ ] **I implemented Create (POST) with error handling**
- [ ] **I implemented Read (GET) for all documents and single document by ID**
- [ ] **I implemented Update (PUT/PATCH) with proper options**
- [ ] **I implemented Delete (DELETE) with existence check**
- [ ] **I built the ApiFeatures class for advanced querying**
- [ ] **I tested my API with query strings (filtering, sorting, pagination)**

---

## 🚀 CodeSync Logic Core Challenge

- [ ] **I completed the Task Management API:**
  - [ ] Created Task model with all required fields
  - [ ] Implemented full CRUD operations
  - [ ] Added ApiFeatures support (filter, sort, paginate)
  - [ ] Tested with complex queries
  - [ ] Added error handling for all edge cases

---

## 📋 Challenge Solution: Task Management API

**File: `models/Task.js`**

```javascript
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "done"],
        message: "Status must be todo, in-progress, or done",
      },
      default: "todo",
    },
    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "Priority must be low, medium, or high",
      },
      default: "medium",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Task", taskSchema);
```

**File: `controllers/taskController.js`**

```javascript
import Task from "../models/Task.js";
import ApiFeatures from "../utils/apiFeatures.js";

// @desc    Get all tasks with filtering, sorting, pagination
// @route   GET /api/tasks
export const getTasks = async (req, res) => {
  try {
    const features = new ApiFeatures(Task.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tasks = await features.query;

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**File: `routes/taskRoutes.js`**

```javascript
import express from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.route("/").get(getTasks).post(createTask);

router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

export default router;
```

---

## 🧠 Self-Assessment

1. **Can you design a Mongoose schema with validation?**

   - [ ] Yes, confidently
   - [ ] Yes, but need to check docs for specific validators
   - [ ] Need more practice

2. **Can you implement full CRUD operations with error handling?**

   - [ ] Yes, I can do it without looking at examples
   - [ ] Yes, with occasional reference
   - [ ] Need to practice more

3. **Can you explain how the ApiFeatures class works?**

   - [ ] Yes, I understand method chaining and each method's purpose
   - [ ] I understand it but need to review the implementation
   - [ ] I need to study it more

4. **Can you write complex MongoDB queries with operators?**
   - [ ] Yes, I'm comfortable with $gte, $in, $regex, etc.
   - [ ] I know the basics but need reference for advanced ones
   - [ ] Need more practice

---

## 🔥 Bonus: ApiFeatures Deep Dive

### The Pattern File

**File: `02-Logic-Core/ApiFeatures-Pattern.md`** (See separate file for detailed breakdown)

---

## 🏆 Tier 2 Completion Certificate

Once you've checked off **ALL** the boxes above:

```
╔══════════════════════════════════════════════╗
║                                              ║
║        ⚙️  TIER 2 MASTERY ACHIEVED ⚙️         ║
║                                              ║
║         The Engine Room is Optimized         ║
║                                              ║
║              Developer: Golu                 ║
║         Date: ___________________            ║
║                                              ║
╚══════════════════════════════════════════════╝
```

---

## 🚀 Example Queries to Test

```bash
# Get all tasks
GET /api/tasks

# Filter by status
GET /api/tasks?status=todo

# Filter by multiple statuses
GET /api/tasks?status=todo&status=in-progress

# Filter by priority
GET /api/tasks?priority=high

# Sort by priority (high to low) then by created date (newest first)
GET /api/tasks?sort=-priority,-createdAt

# Pagination (page 2, 5 items per page)
GET /api/tasks?page=2&limit=5

# Complex query: High priority todos, sorted by date, page 1
GET /api/tasks?priority=high&status=todo&sort=-createdAt&page=1&limit=10

# Select specific fields only
GET /api/tasks?fields=title,status,priority
```

---

**Next Mission:** [Tier 3: Security & State →](../03-Security-State/Guide.md)

**Boss, your database game is STRONG now!** 💪⚙️
