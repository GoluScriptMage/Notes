const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/userModel");

// VIP PASS Entry Plan or GUIDE Section 5
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Use an environment variable for the callback URL so it's easy to
      // change between environments (development, staging, production).
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:3001/auth/google/callback",
    },
    // VIP PASS Entry Function
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find if user Exist
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });

        // Return if user exists
        if (existingUser) {
          return done(null, existingUser);
        }

        // If not create user
        const newUser = new User({
          email: profile.emails[0].value,
          name: profile.displayName,
          image: profile.photos[0].value,
        });

        const savedUser = await newUser.save();
        // Return the user
        return done(null, savedUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Giving the user just a id not the entire object
// Serialize User section 6
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Checking the user in the list with its id
// deserializeUser section 6
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
