const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const photo = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"));
        }

        let user = await User.findOne({ username: email });

        if (!user) {
          user = new User({
            googleId: profile.id,
            username: email,
            displayName: profile.displayName,
            avatar: photo || "", // fallback to empty string
          });

          await user.save();
        }

        done(null, user);
      } catch (error) {
        console.error("Error in GoogleStrategy callback:", error);
        done(error);
      }
    }
  )
);
