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
<<<<<<< HEAD
    function (email, password, done) {
      UserModel.findOne({ email: email })
=======
    function(email, password, done) {
      if (password === "") {
        return done(null, false);
      }
      return UserModel.findOne({ email: email })
>>>>>>> Fix small bugs, rewrite login for forgotpassword, redesign content of prices
        .then(user => {
          if (!user) {
            console.log("INFO: user not found in passport");
            return done(null, false);
          }
<<<<<<< HEAD
          console.log(`INFO: compare password ${password} and hash ${user.password}`);
          if (!validatePassword(user, password)) {
            return done(null, false)
          } else {
            return done(null, user)
          }
=======
          bcrypt.compare(password, user.password).then(res => {
            if (res) {
              done(null, user);
            } else {
              bcrypt.compare(password, user.tempPassword).then(res => {
                if (res) {
                  user.tempPassword = "";
                  UserModel.findByIdAndUpdate(user._id, user, {new: true}, (err, doc) => {
                    if (err) {
                      done(null, false);
                    } else {
                      done(null, user);
                    }
                  });
                } else {
                  done(null, false);
                }
              });
            }
          });
>>>>>>> Fix small bugs, rewrite login for forgotpassword, redesign content of prices
        })
        .catch(err => done(err));
    }
  )
);
