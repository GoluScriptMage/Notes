# 🔐 Tier 3: Security & State - OAuth & Session Mastery

> **"Security is where pros separate from beginners. This is your vault."**

---

## 🎯 Mission Objective

Master the **highest level of authentication and session management**. By the end of this tier, you'll understand:

- OAuth 2.0 Flow (Google Strategy)
- Passport.js (Serialize/Deserialize)
- Express-Session (Server-side sessions)
- CORS Configuration (Cross-Origin Security)
- Protected Routes (Auth Middleware)

**This is the tier that makes your app production-ready.**

---

## 📚 Core Concepts

### 1. Authentication vs Authorization - The "Funda"

**Analogy:** Think of a hotel.

- **Authentication** = Checking your ID at reception (Who are you?)
- **Authorization** = Your room key only opens YOUR room (What can you do?)

```javascript
// Authentication: Verify user identity
app.post("/auth/login", (req, res) => {
  // Check if user credentials are correct
});

// Authorization: Check if user has permission
app.get("/admin/dashboard", isAdmin, (req, res) => {
  // Only admins can access this
});
```

---

### 2. OAuth 2.0 - The "Funda"

**Analogy:** OAuth is like **valet parking**. You give the valet (Google) a special key that can only start the car, not open the trunk. They can't access everything.

**The Flow:**

```
1. User clicks "Login with Google"
2. Redirected to Google's login page
3. User logs in and approves access
4. Google sends back an "authorization code"
5. Your server exchanges code for user info
6. User is logged in to your app!
```

**Why OAuth?** You don't handle passwords! Google does the hard work, you just get user info.

---

### 3. Setting Up Passport.js with Google OAuth

**Installation:**

```bash
npm install passport passport-google-oauth20 express-session dotenv
```

**File: `.env`**

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
SESSION_SECRET=your_random_secret_here
```

**File: `config/passport.js`**

```javascript
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

export const configurePassport = () => {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Create new user
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
            });
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user (store user ID in session)
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user (retrieve user from database using session ID)
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};
```

**🧠 Quick Test:** What's the difference between `serializeUser` and `deserializeUser`?

<details>
<summary>Click to reveal answer</summary>

**Answer:**

- **`serializeUser`** → Runs **after login**. Decides what to store in the session (usually just the user ID to keep sessions lightweight).

  ```javascript
  // Stores user.id in session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  ```

- **`deserializeUser`** → Runs **on every request**. Retrieves the full user object from the database using the ID stored in the session.
  ```javascript
  // Fetches user from DB using session ID
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user); // Makes user available as req.user
  });
  ```

**Why this pattern?** Sessions store minimal data (just ID). Full user data is fetched only when needed.

</details>

---

### 4. Setting Up Express-Session

**File: `server.js`**

```javascript
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { configurePassport } from "./config/passport.js";

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow cookies
  })
);

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production (HTTPS only)
      httpOnly: true, // Prevents JavaScript access to cookies
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport strategies
configurePassport();

app.listen(5000, () => console.log("Server running on port 5000"));
```

**🧠 Quick Test:** What does `credentials: true` in CORS do?

<details>
<summary>Click to reveal answer</summary>

**Answer:** It allows the **frontend to send cookies** with requests!

Without `credentials: true`:

- Cookies are blocked by the browser's CORS policy
- Sessions won't work across frontend/backend

**Frontend must also enable credentials:**

```javascript
// With fetch
fetch("http://localhost:5000/auth/status", {
  credentials: "include",
});

// With Axios
axios.get("/auth/status", {
  withCredentials: true,
});
```

</details>

---

### 5. Auth Routes - The Full Flow

**File: `routes/authRoutes.js`**

```javascript
import express from "express";
import passport from "passport";

const router = express.Router();

// @route   GET /auth/google
// @desc    Initiate Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    // Successful authentication
    res.redirect("http://localhost:3000/dashboard");
  }
);

// @route   GET /auth/status
// @desc    Check if user is logged in
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    res.status(401).json({ isAuthenticated: false, user: null });
  }
});

// @route   GET /auth/logout
// @desc    Logout user
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.status(200).json({ message: "Logged out successfully" });
  });
});

export default router;
```

---

### 6. Protected Routes - Auth Middleware

**File: `middleware/authMiddleware.js`**

```javascript
export const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is logged in, proceed
  }
  res.status(401).json({ error: "Unauthorized. Please login." });
};

export const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ error: "Forbidden. Admin access only." });
};
```

**Using Middleware:**

```javascript
import { isAuthenticated, isAdmin } from "../middleware/authMiddleware.js";

// Protected route - any logged-in user
router.get("/dashboard", isAuthenticated, (req, res) => {
  res.json({ message: "Welcome to your dashboard", user: req.user });
});

// Admin-only route
router.get("/admin/users", isAdmin, (req, res) => {
  res.json({ message: "Admin panel" });
});
```

---

### 7. The Complete User Model

**File: `models/User.js`**

```javascript
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
```

---

## 🔥 The CodeSync Security Challenge

### **Your Mission: Implement Full OAuth Authentication**

**Requirements:**

1. Set up Google OAuth with Passport.js
2. Create `/auth/status` endpoint
3. Create protected routes that require login
4. Implement role-based authorization (user vs admin)
5. Add proper CORS configuration

**Try it yourself!** Solution in **[Mission-Checklist.md](./Mission-Checklist.md)**.

---

## 🎓 Next Steps

Go to **[Practice-Questions.md](./Practice-Questions.md)** to test your security knowledge!

Go to **[Passport-Flow.md](./Passport-Flow.md)** for a detailed flow diagram!

**Boss, you're becoming a security expert!** 💪🔐
