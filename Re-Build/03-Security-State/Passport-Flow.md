# 📘 Passport OAuth Flow - Visual Guide

> **"Understanding the flow is the key to mastering OAuth."**

---

## 🔄 The Complete OAuth 2.0 Flow

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. User clicks "Login with Google"
       │    GET /auth/google
       │
       ▼
┌──────────────┐
│  Your Server │
│  (Backend)   │
└──────┬───────┘
       │
       │ 2. Redirect to Google Login
       │    (Passport handles this)
       │
       ▼
┌──────────────┐
│    Google    │
│ OAuth Server │
└──────┬───────┘
       │
       │ 3. User logs in and approves access
       │
       │ 4. Google redirects back with code
       │    GET /auth/google/callback?code=xyz123
       │
       ▼
┌──────────────┐
│  Your Server │
│  (Backend)   │
└──────┬───────┘
       │
       │ 5. Server exchanges code for user info
       │    (Passport does this automatically)
       │
       │ 6. Create/Update user in database
       │
       │ 7. Serialize user (store ID in session)
       │
       │ 8. Redirect to frontend dashboard
       │
       ▼
┌─────────────┐
│   Browser   │
│ (Dashboard) │
└─────────────┘
```

---

## 🧩 Step-by-Step Breakdown

### **Step 1: User Initiates Login**

**Frontend:**

```jsx
<a href="http://localhost:5000/auth/google">Login with Google</a>
```

**Backend (routes/authRoutes.js):**

```javascript
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
```

**What happens:** Passport redirects user to Google's login page.

---

### **Step 2: Google Authenticates User**

User sees Google's login page and approves access to:

- Profile information
- Email address

---

### **Step 3: Google Redirects Back with Code**

Google sends user back to your callback URL:

```
http://localhost:5000/auth/google/callback?code=4/0AY0e-g7...
```

This `code` is an **authorization code** (short-lived, one-time use).

---

### **Step 4: Server Exchanges Code for User Info**

**Backend (config/passport.js):**

```javascript
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // profile contains user info from Google
      console.log(profile);

      // {
      //   id: '123456789',
      //   displayName: 'Golu Dhakad',
      //   emails: [{ value: 'golu@example.com' }],
      //   photos: [{ value: 'https://...' }]
      // }

      // Check if user exists, create if not
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });
      }

      return done(null, user); // Pass user to serializeUser
    }
  )
);
```

---

### **Step 5: Serialize User (Store in Session)**

**Backend (config/passport.js):**

```javascript
passport.serializeUser((user, done) => {
  done(null, user.id); // Store only user ID in session
});
```

**Session Storage:**

```javascript
// Express-session stores this in memory (or database)
{
  passport: {
    user: "64a3b2c1d5e6f7g8h9i0j1k2"; // MongoDB user ID
  }
}
```

---

### **Step 6: Redirect to Frontend**

**Backend (routes/authRoutes.js):**

```javascript
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("http://localhost:3000/dashboard");
  }
);
```

User is now on the frontend dashboard, **logged in**!

---

## 🔁 How Sessions Work on Subsequent Requests

### **Every Request After Login:**

**Frontend makes request:**

```javascript
fetch("http://localhost:5000/api/tasks", {
  credentials: "include", // Send cookies
});
```

**Backend flow:**

1. Browser sends session cookie automatically
2. `deserializeUser` runs (fetches user from DB using session ID)
3. User data available as `req.user`

**Backend (config/passport.js):**

```javascript
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user); // Makes user available as req.user
});
```

**In your routes:**

```javascript
router.get("/dashboard", isAuthenticated, (req, res) => {
  console.log(req.user); // Full user object!
  res.json({ message: "Welcome", user: req.user });
});
```

---

## 🔑 Key Concepts

### **1. What is `serializeUser`?**

- Runs **once after login**
- Decides what to store in session (usually just user ID)
- Keeps session lightweight

### **2. What is `deserializeUser`?**

- Runs **on every request**
- Fetches full user from database using session ID
- Makes user available as `req.user`

### **3. What is `req.isAuthenticated()`?**

- Passport method that returns `true` if user is logged in
- Used in middleware to protect routes

### **4. What is the session cookie?**

- A cryptographically signed cookie stored in the browser
- Contains the session ID (NOT the user data)
- Sent automatically with every request to your server

---

## 🧠 Common Questions

### **Q: Where is the session data stored?**

**Answer:** By default, in **server memory** (for development).

For production, use a **session store** like:

- **MongoDB** (with `connect-mongo`)
- **Redis** (with `connect-redis`)

**Example with MongoDB:**

```javascript
import MongoStore from "connect-mongo";

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
  })
);
```

### **Q: How does the frontend know if user is logged in?**

**Answer:** Call the `/auth/status` endpoint on app load:

```javascript
// Frontend (React)
useEffect(() => {
  fetch("http://localhost:5000/auth/status", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.isAuthenticated) {
        setUser(data.user);
      }
    });
}, []);
```

### **Q: Why `credentials: true` in CORS?**

**Answer:** Without it, the browser **blocks cookies** for cross-origin requests!

**Backend:**

```javascript
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allow cookies
  })
);
```

**Frontend:**

```javascript
fetch("http://localhost:5000/api", {
  credentials: "include", // Send cookies
});
```

---

## 🔥 The Complete Flow in Code

### **Backend Setup:**

```javascript
// server.js
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { configurePassport } from "./config/passport.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use("/auth", authRoutes);
app.use("/api/tasks", isAuthenticated, taskRoutes);

app.listen(5000);
```

### **Frontend Usage:**

```jsx
// Login Button
<a href="http://localhost:5000/auth/google">Login with Google</a>;

// Check Auth Status
useEffect(() => {
  axios
    .get("http://localhost:5000/auth/status", {
      withCredentials: true,
    })
    .then((res) => {
      if (res.data.isAuthenticated) {
        setUser(res.data.user);
      }
    });
}, []);

// Protected API Call
axios.get("http://localhost:5000/api/tasks", {
  withCredentials: true,
});
```

---

**This is the complete OAuth flow you learned before! Now you have the clarity.** 🚀🔐

**Back to:** [Tier 3 Guide](./Guide.md) | [Practice Questions](./Practice-Questions.md)
