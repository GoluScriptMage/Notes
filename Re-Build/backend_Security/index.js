import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { passportSetup } from "./config/passport-setup.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// middleWare
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Database connection
const connectDB = async () => {
  try {
    // Database Connection
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MONGODB server connected");
  } catch (error) {
    console.log("MongoDB connection failed", error);
    process.exit(1);
  }
};

connectDB();

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "UnAuthorized" });
};

// Autheentication Middlewares
// Step 1
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL,
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000, // 1 Day
    },
  })
);

// Step 2
app.use(passport.initialize());

// Step 3
app.use(passport.session());

// Configure Passport strategies
passportSetup();

// routes
app.use("/auth", authRoutes);
app.use("/api", checkAuth, taskRoutes);

// server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
