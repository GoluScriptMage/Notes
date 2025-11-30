# 📘 The ApiFeatures Pattern - Deep Dive

> **"This is the high-level pattern you mastered before. Let's rebuild it with clarity."**

---

## 🎯 What is ApiFeatures?

**ApiFeatures** is a **reusable class** that adds powerful querying capabilities to your APIs:

- **Filtering** (e.g., `?price[gte]=1000`)
- **Sorting** (e.g., `?sort=-price,name`)
- **Field Selection** (e.g., `?fields=name,price`)
- **Pagination** (e.g., `?page=2&limit=10`)

**Why is it "high-level"?** Because it uses **method chaining** and **object-oriented patterns** to keep your code DRY (Don't Repeat Yourself).

---

## 🔍 The Full Implementation

**File: `utils/apiFeatures.js`**

```javascript
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query (e.g., Product.find())
    this.queryString = queryString; // req.query from Express
  }

  filter() {
    // 1. Copy query object
    const queryObj = { ...this.queryString };

    // 2. Remove fields that aren't filters
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach((field) => delete queryObj[field]);

    // 3. Advanced filtering (gte, lte, gt, lt, in)
    // Convert: { price: { gte: '1000' } } → { price: { $gte: 1000 } }
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`
    );

    // 4. Apply to Mongoose query
    this.query = this.query.find(JSON.parse(queryStr));

    return this; // Enable chaining
  }

  sort() {
    if (this.queryString.sort) {
      // Convert: 'price,name' → 'price name' (Mongoose format)
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      // Default: Sort by newest first
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // Convert: 'name,price' → 'name price'
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // Exclude __v by default (Mongoose version key)
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryString.page, 10) || 1;
    const limit = parseInt(this.queryString.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // Skip and limit results
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default ApiFeatures;
```

---

## 🧠 How Each Method Works

### 1. **filter()** - The Smart Filtering Engine

**What it does:**

- Removes non-filter params (`page`, `sort`, etc.)
- Converts URL params to MongoDB operators

**Example:**

```javascript
// URL: /api/products?category=electronics&price[gte]=1000&price[lte]=5000

// Step 1: queryObj = { category: 'electronics', price: { gte: '1000', lte: '5000' } }

// Step 2: After excludeFields = { category: 'electronics', price: { gte: '1000', lte: '5000' } }

// Step 3: After regex replace:
// { category: 'electronics', price: { $gte: 1000, $lte: 5000 } }

// Step 4: Mongoose query:
Product.find({ category: "electronics", price: { $gte: 1000, $lte: 5000 } });
```

---

### 2. **sort()** - Intelligent Sorting

**What it does:**

- Parses comma-separated sort fields
- Defaults to newest first if no sort specified

**Example:**

```javascript
// URL: /api/products?sort=-price,name

// Converts to Mongoose format:
Product.find().sort("-price name");
// -price = descending (high to low)
// name = ascending (A to Z)
```

**Common Sort Patterns:**

```bash
?sort=price           # Cheapest first
?sort=-price          # Most expensive first
?sort=-createdAt      # Newest first
?sort=name            # Alphabetical A-Z
?sort=-priority,name  # High priority first, then alphabetical
```

---

### 3. **limitFields()** - Select Specific Fields

**What it does:**

- Allows frontend to request only needed fields
- Reduces data transfer (improves performance)

**Example:**

```javascript
// URL: /api/products?fields=name,price,category

// Mongoose query:
Product.find().select('name price category')

// Response:
[
  { _id: '...', name: 'Laptop', price: 50000, category: 'electronics' },
  // Other fields like 'description', 'stock' are NOT included
]
```

---

### 4. **paginate()** - Smart Pagination

**What it does:**

- Splits results into pages
- Calculates `skip` and `limit` automatically

**Example:**

```javascript
// URL: /api/products?page=3&limit=5

// Calculation:
page = 3
limit = 5
skip = (3 - 1) * 5 = 10

// Mongoose query:
Product.find().skip(10).limit(5)
// Returns products 11-15 (page 3)
```

**Pagination Logic:**

```
Page 1: Items 1-10   (skip 0, limit 10)
Page 2: Items 11-20  (skip 10, limit 10)
Page 3: Items 21-30  (skip 20, limit 10)
```

---

## 🔥 How to Use ApiFeatures

**In your controller:**

```javascript
import ApiFeatures from "../utils/apiFeatures.js";

export const getProducts = async (req, res) => {
  try {
    // Create features instance with method chaining
    const features = new ApiFeatures(Product.find(), req.query)
      .filter() // Apply filters
      .sort() // Apply sorting
      .limitFields() // Select fields
      .paginate(); // Apply pagination

    // Execute query
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

---

## 🎯 Method Chaining Explained

**Why do we return `this`?**

```javascript
filter() {
  // ... logic
  return this; // Returns the entire ApiFeatures instance
}
```

**Without `return this`:**

```javascript
const features = new ApiFeatures(Product.find(), req.query);
features.filter();
features.sort();
features.paginate();
const products = await features.query;
```

**With `return this` (Method Chaining):**

```javascript
const features = new ApiFeatures(Product.find(), req.query)
  .filter()
  .sort()
  .paginate();

const products = await features.query;
```

**This is the "fluent interface" pattern - it makes code cleaner and more readable!**

---

## 🧠 Advanced: Adding Search Functionality

Want to add text search? Here's how:

```javascript
class ApiFeatures {
  // ... existing methods

  search() {
    if (this.queryString.search) {
      this.query = this.query.find({
        $or: [
          { title: { $regex: this.queryString.search, $options: "i" } },
          { description: { $regex: this.queryString.search, $options: "i" } },
        ],
      });
    }
    return this;
  }
}

// Usage:
// GET /api/products?search=laptop
// Finds products where title OR description contains "laptop" (case-insensitive)
```

---

## 💡 Pro Tips

### 1. **Always exclude pagination/sort params from filter**

```javascript
const excludeFields = ["page", "sort", "limit", "fields", "search"];
```

### 2. **Use default values for pagination**

```javascript
const page = parseInt(this.queryString.page, 10) || 1; // Default: page 1
const limit = parseInt(this.queryString.limit, 10) || 10; // Default: 10 items
```

### 3. **Add search to excludeFields if you implement it**

```javascript
const excludeFields = ["page", "sort", "limit", "fields", "search"];
```

### 4. **Chain methods in logical order**

```javascript
new ApiFeatures(Model.find(), req.query)
  .search() // 1. First narrow down with search
  .filter() // 2. Then apply filters
  .sort() // 3. Then sort results
  .limitFields() // 4. Then select fields
  .paginate(); // 5. Finally paginate
```

---

## 🎓 Self-Test

**Q1:** What does this URL do?

```
GET /api/products?category=electronics&price[gte]=5000&sort=-price&page=2&limit=5&fields=name,price
```

<details>
<summary>Answer</summary>

1. **Filter:** Electronics category, price >= 5000
2. **Sort:** By price descending (highest first)
3. **Paginate:** Page 2 (items 6-10)
4. **Fields:** Only name and price in response

</details>

**Q2:** Why do we convert `gte` to `$gte`?

<details>
<summary>Answer</summary>

Because **MongoDB uses `$gte`, not `gte`**!

URL params can't have `$` (special character), so we use `gte` in the URL and convert it to `$gte` in the backend.

</details>

---

**This is the pattern that powers professional APIs. Master it, and you're unstoppable!** 🚀💪

**Back to:** [Tier 2 Guide](./Guide.md) | [Mission Checklist](./Mission-Checklist.md)
