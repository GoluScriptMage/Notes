const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRouter = require("./routes/authRouter");
const rateLimit = require("express-rate-limit");

// Load environment variables as early as possible so any required config
// (e.g. passport strategies) can read them.
dotenv.config();

// Passport-setup depends on process.env values (GOOGLE_CLIENT_ID, etc.)
// so require it after dotenv has loaded environment variables.
require("./config/passport-setup");

console.log(process.env.DATABASE_URL);

// MongoDB connection
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error while connecting to MongoDB", err);
  });

// FN for the Bouncer
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/google");
};

// Rate Limiter Middleware
const appLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 50, // Limit of the req per ip at certain time
  message: "Too many requests from this IP, please try again Later!",
});

// Apply rate limiter to all requests
app.use(appLimiter)

// 1. Session middleware always at first
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production", // set is true on production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// 2. Passport initialization (always after session)
app.use(passport.initialize());

// 3. Passport session handling
app.use(passport.session());

// middleWares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.get("/success", isAuthenticated, (req, res, next) => {
  res.json({
    message: `Welcome ${req.user.name}! You have successfully logged in.`,
    user: req.user,
  });
}); // Bouncer MiddleWare

//Routes
app.use("/auth", authRouter);

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!", timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
