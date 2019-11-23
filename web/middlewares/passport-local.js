const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");

require("../db");

function validatePassword(user, password) {
  bcrypt.compare(password, user.password).then(res => {
    return res;
  });
}

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function(email, password, done) {
      return UserModel.findOne({ email: email })
        .then(user => {
          if (!user) {
            console.log("INFO: user not found in passport");
            return done(null, false);
          }
          if (validatePassword(user, password) == false) {
            console.log("INFO: invalid password");
            return done(null, false);
          }
          return done(null, user);
        })
        .catch(err => done(err));
    }
  )
);
