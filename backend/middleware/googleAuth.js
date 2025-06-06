const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRECT = process.env.GOOGLE_CLIENT_SECRECT;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRECT,
      callbackURL: "/user/google/callback",
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
