const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRECT = process.env.GOOGLE_CLIENT_SECRECT;
const CALLBACK_URL =
  process.env.NODE_ENV === "production"
    ? "https://scripture-xi.vercel.app/user/google/callback"
    : "http://localhost:3000/user/google/callback";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRECT,
      callbackURL: CALLBACK_URL,
    },

    async (accesToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id }); // ✅ Correct

        if (!user) {
          user = await User.create({
            username: profile.displayName,
            googleId: profile.id,
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});
module.exports = passport;
