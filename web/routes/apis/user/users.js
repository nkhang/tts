var express = require("express");
var router = express.Router();
const User = require("../../../models/User");
const bcrypt = require("bcrypt");
require("../../../db");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../../../validation/register");
const validateLogoutInput = require("../../../validation/logout");
//register
// @route   POST /users/register
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ data: {}, error: errors });
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.message = "Email already exists";
      errors.code = 1010;
      return res.status(400).json({ data: {}, error: errors });
    } else {
      let body = req.body;
      const newUser = new User({
        fullname: body.fullname,
        email: body.email,
        password: body.password,
        numberPhone: body.numberPhone
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              delete user["_id"];
              delete user["password"];
              console.log(user);
              res.json({
                success: true,
                data: {
                  email: user.email
                },
                error: {}
              });
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});


// @route   POST /users/login
router.post("/login", (req, res) => {
  passport.authenticate(
    "local",
    { session: false, failureRedirect: "/login" },
    (err, user) => {
      if (user) {
        jwt.sign({ user: user }, "StRoNGs3crE7", (err, token) => {
          if (err) {
            return res.redirect("/login");
          }
          console.log(token);
          res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: true
            // signed: true,
            // secure: true
          });
          console.log("set cookie successfully");
          return res.redirect("/");
        });
      }
    }
  )(req, res);
});

// @route   POST /users/logout
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect("/login");
});

// @route   POST /users/logout
router.post("/checkToken", (req, res) => {
  const { errors, isValid } = validateLogoutInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ data: {}, error: errors });
  }

  const id = req.body.id;
  const token = req.body.token;

  // Find user by id
  User.findById(id)
    .exec()
    .then(user => {
      // Check for user
      if (!user) {
        errors.message = "User not found";
        errors.code = 1011;
        return res.status(400).json({ data: {}, error: errors });
      }

      if (user.token === token) {
        res.json({ data: { result: true }, error: {} });
      } else {
        res.json({ data: { result: false }, error: {} });
      }
    });
});

/* GET users listing. */
router.post("/", async (req, res) => {
  try {
    var user = new User(req.body);
    var result = await user.save();
    res.send({ data: result, error: {} });
  } catch (error) {
    res.status(500).send({ data: {}, error: error });
  }
});

router.get("/", async (req, res) => {
  try {
    var result = await User.find().exec();
    res.send({ data: result, error: {} });
  } catch (error) {
    res.status(500).send({ data: {}, error: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    var user = await User.findById(req.params.id).exec();
    res.send({ data: result, error: {} });
  } catch (error) {
    res.status(500).send({ data: {}, error: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    var user = await User.findById(req.params.id).exec();
    user.set(req.body);
    var result = await user.save();
    res.send({ data: result, error: {} });
  } catch (error) {
    res.status(500).send({ data: {}, error: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    var result = await User.deleteOne({ _id: req.params.id }).exec();
    res.send({ data: result, error: {} });
  } catch (error) {
    res.status(500).send({ data: {}, error: error });
  }
});

module.exports = router;
