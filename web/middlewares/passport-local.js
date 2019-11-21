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
          bcrypt.compare(password, user.password).then(res => {
            if (res) {
              done(null, user)
            } else {
              done(null, false)
            }
          })
        })
        .catch(err => done(err));
    }
  )
);
