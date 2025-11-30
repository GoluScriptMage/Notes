import express from "express";
import passport from "passport";

const router = express.Router();

// DEBUG ROUTE - Check if Google credentials are loaded
router.get("/debug", (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID ? "✅ Loaded" : "❌ Missing",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? "✅ Loaded" : "❌ Missing",
    callbackURL: "http://localhost:3002/auth/google/callback",
    port: process.env.PORT,
  });
});

// Auth routes
// Setting the route 'auth/google' to starts up the flow
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/dashboard",
    failureRedirect: "http://localhost:5173/login",
  })
);

// route to send the auth status to frontend
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isAuthenticated: true, user: req.user });
  } else {
    res.json({ isAuthenticated: false });
  }
});

// to logout
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ message: "Logout Successful" });
  });
});

export default router;
