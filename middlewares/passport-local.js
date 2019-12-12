const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const UserModel = require("../models/User");
const bcrypt = require("bcryptjs");

require("../db");

function validatePassword(user, password) {
  return bcrypt.compareSync(password, user.password) || bcrypt.compareSync(password, user.tempPassword)
}

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    function (email, password, done) {
      UserModel.findOne({ email: email })
        .then(user => {
          if (!user) {
            console.log("INFO: user not found in passport");
            return done(null, false);
          }
          console.log(`INFO: compare password ${password} and hash ${user.password}`);
          if (!validatePassword(user, password)) {
            return done(null, false)
          } else {
            user.tempPassword = ""
            user.save()
            return done(null, user)
          }
        })
        .catch(err => done(err));
    }
  )
);
