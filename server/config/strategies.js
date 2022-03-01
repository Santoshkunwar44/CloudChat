const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const bcrypt = require("bcrypt");
const user = require("../Models/user");

const GITHUB_CLIENT_ID = "700b6ee240a03d112fe8";
const GITHUB_CLIENT_SECRET = "6e63f674c646368ffb548571597762cdd57f2a4a";
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      scope: ["user:email"],
      callbackURL: "http://localhost:8000/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
