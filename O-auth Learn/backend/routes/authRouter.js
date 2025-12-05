const express = require("express");
const passport = require("passport");
const router = express.Router();

// auth Routes

// Route 1. Start the OAuth Flow process
// -> Redirect to this route -> redirect it to google to authenticate -> Fail then login -> if success then designated page
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Route 2. Callback Route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000",
    failureRedirect: "http://localhost:3000/login",
  })
);

// Route 3. Logout Route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    // case if it failed but it never seems to fail
    if (err) {
      return next(err);
    }
    res.clearCookie("connect.sid"); // clean up the cookie as well
    // For success Case
    return res.json({ success: true, message: "Logged out successfully" });
  });
});

// To tell the frontend if any one aithenitiacted or not
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      isAuthenticated: true,
      name: req.user.name,
      email: req.user.email,
      image: req.user.image,
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

module.exports = router;
