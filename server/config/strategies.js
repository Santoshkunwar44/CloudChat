const User = require("../Models/user");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const GOOGLE_CLIENT_ID =
  "573239136179-lmf02gf518d0ln93cj3up4vm6mrn8e4p.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      const profileObj = {
        email: profile.emails[0].value,
        userName: profile.displayName,
        pic: profile.photos[0].value,
        password: "loginedfrom321",
      };
      User.create(profileObj, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

passport.serializeUser(function (user, done) {

  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});
