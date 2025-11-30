# 🧠 Tier 2: Practice Questions

> **"Database mastery separates beginners from professionals."**

---

## Question 1: Schema Validation

**Q:** What happens when you try to create this user?

```javascript
const user = await User.create({
  name: "  Golu  ",
  email: "GOLU@EXAMPLE.COM",
});
```

Assume this schema:

```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
});
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

The user will be created with:

```javascript
{
  name: 'Golu',  // trim: true removes spaces
  email: 'golu@example.com',  // lowercase: true converts to lowercase
}
```

**Key Schema Options:**

- `trim: true` → Removes leading/trailing whitespace
- `lowercase: true` → Converts to lowercase
- `uppercase: true` → Converts to uppercase
- `default: value` → Sets default if field not provided
- `required: true` → Field must be provided
- `unique: true` → No duplicate values allowed

</details>

---

## Question 2: CRUD Operations

**Q:** What's wrong with this code?

```javascript
export const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({ data: user });
};
```

<details>
<summary>Click to reveal answer</summary>

**Answer:** **No error handling!**

**Problems:**

1. What if `req.params.id` is invalid? → Mongoose throws `CastError`
2. What if user doesn't exist? → Returns `null`, but status is still 200
3. No try/catch block → Server crashes on errors

**Correct Version:**

```javascript
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    // CastError (invalid ObjectId) will be caught here
    res.status(500).json({ error: error.message });
  }
};
```

</details>

---

## Question 3: findByIdAndUpdate vs findOneAndUpdate

**Q:** What's the difference between these two?

```javascript
// Option 1
await User.findByIdAndUpdate(id, { name: "New Name" });

// Option 2
await User.findOneAndUpdate({ _id: id }, { name: "New Name" });
```

<details>
<summary>Click to reveal answer</summary>

**Answer:**

They do the **same thing**! `findByIdAndUpdate(id)` is just a shortcut for `findOneAndUpdate({ _id: id })`.

**Important Options:**

```javascript
await User.findByIdAndUpdate(
  id,
  { name: "New Name" },
  {
    new: true, // Return updated doc (default: returns old doc)
    runValidators: true, // Run schema validations (default: false)
  }
);
```

**Pro Tip:** Always use `new: true` and `runValidators: true` for updates!

</details>

---

## Question 4: Query Operators

**Q:** Write a Mongoose query to find all products where:

- Price is between 1000 and 5000
- Category is either 'electronics' or 'gadgets'
- In stock (stock > 0)

<details>
<summary>Click to reveal answer</summary>

**Answer:**

```javascript
const products = await Product.find({
  price: { $gte: 1000, $lte: 5000 },
  category: { $in: ["electronics", "gadgets"] },
  stock: { $gt: 0 },
});
```

**Common Operators:**

- `$gte` → Greater than or equal
- `$lte` → Less than or equal
- `$gt` → Greater than
- `$lt` → Less than
- `$in` → Matches any value in array
- `$ne` → Not equal

</details>

---

## Question 5: Understanding ApiFeatures

**Q:** Given this URL:

```
GET /api/products?category=electronics&price[gte]=1000&sort=-price&page=2&limit=5
```

What does the ApiFeatures class do at each step?

<details>
<summary>Click to reveal answer</summary>

**Answer:**

**Step 1: Filter**

```javascript
filter() {
  // Extracts: { category: 'electronics', price: { $gte: 1000 } }
  // Excludes: page, sort, limit (pagination/sorting params)
}
```

**Step 2: Sort**

```javascript
sort() {
  // Sorts by price descending (-price means highest first)
  this.query = this.query.sort('-price');
}
```

**Step 3: Paginate**

```javascript
paginate() {
  // Page 2, Limit 5 → Skip first 5, return next 5
  const skip = (2 - 1) * 5; // 5
  this.query = this.query.skip(5).limit(5);
}
```

**Final Query:**

- Electronics category
- Price >= 1000
- Sorted by price (high to low)
- Products 6-10 (page 2)

</details>

---

## Question 6: Method Chaining in ApiFeatures

**Q:** Why does every method in ApiFeatures return `this`?

```javascript
class ApiFeatures {
  filter() {
    // ... filtering logic
    return this; // Why?
  }

  sort() {
    // ... sorting logic
    return this; // Why?
  }
}
```

<details>
<summary>Click to reveal answer</summary>

**Answer:** To enable **method chaining**!

Without `return this`:

```javascript
const features = new ApiFeatures(Product.find(), req.query);
features.filter();
features.sort();
features.paginate();
const products = await features.query;
```

With `return this`:

```javascript
const features = new ApiFeatures(Product.find(), req.query)
  .filter()
  .sort()
  .paginate();

const products = await features.query;
```

**This is the "High-Level Pattern" you learned before!** It makes code cleaner and more readable.

</details>

---

## Question 7: Populate (Relationships)

**Q:** You have two models:

```javascript
// Post model
const postSchema = new mongoose.Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
```

How do you fetch a post with the author's full details?

<details>
<summary>Click to reveal answer</summary>

**Answer:**

```javascript
const post = await Post.findById(postId).populate('author');

// Without populate:
{
  _id: '...',
  title: 'My Post',
  author: '64a3b2c1d5e6f7g8h9i0j1k2' // Just the ID
}

// With populate:
{
  _id: '...',
  title: 'My Post',
  author: {
    _id: '64a3b2c1d5e6f7g8h9i0j1k2',
    name: 'Golu',
    email: 'golu@example.com'
  }
}
```

**Advanced Populate:**

```javascript
// Select specific fields
await Post.findById(postId).populate("author", "name email");

// Populate multiple fields
await Post.findById(postId).populate("author").populate("comments");
```

</details>

---

## 🎯 Challenge Question: Build Advanced Features

**Task:** Enhance your Task API with:

1. **Search by title:**

   ```
   GET /api/tasks?search=urgent
   ```

   Should find tasks where title contains "urgent" (case-insensitive)

2. **Filter by multiple statuses:**

   ```
   GET /api/tasks?status=todo,in-progress
   ```

3. **Sort by multiple fields:**
   ```
   GET /api/tasks?sort=priority,-createdAt
   ```
   (High priority first, then newest)

**Hint:** You'll need to modify the ApiFeatures class!

<details>
<summary>Click to see solution</summary>

**Enhanced ApiFeatures:**

```javascript
class ApiFeatures {
  // ... existing methods

  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        title: { $regex: this.queryString.search, $options: "i" },
      });
    }
    return this;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields", "search"];
    excludeFields.forEach((field) => delete queryObj[field]);

    // Handle comma-separated values (e.g., status=todo,done)
    Object.keys(queryObj).forEach((key) => {
      if (queryObj[key].includes(",")) {
        queryObj[key] = { $in: queryObj[key].split(",") };
      }
    });

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }
}

// Usage:
const features = new ApiFeatures(Task.find(), req.query)
  .search()
  .filter()
  .sort()
  .paginate();
```

</details>

---

**Ready for security?** → [Go to Tier 3: Security & State](../03-Security-State/Guide.md)

**Boss, you're mastering the database!** 💪⚙️
