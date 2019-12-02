var express = require("express");
var router = express.Router();

require("../../../db");
const User = require("../../../models/User");
const bcrypt = require("bcryptjs");
require("../../../db");
const passport = require("passport");
const jwt = require("jsonwebtoken");

var nodemailer = require('nodemailer');

const auth = require("../../../middlewares/auth.mdw");
const validateRegisterInput = require("../../../validation/register");
const validateLogoutInput = require("../../../validation/logout");
const validateForgotPasswordInput = require("../../../validation/fogotpassword");
const validateInfoInput = require("../../../validation/changeinfo");
const validatePasswordInput = require("../../../validation/changepassword");


//register
// @route   POST /users/register
router.post("/register", (req, res, next) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return next({
      status: 400,
      code: errors.code,
      message: errors.message
    })
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return next({
        status: 400,
        code: 1010,
        message: "Email already exists"
      })
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
              // delete user["_id"];
              // delete user["password"];
              console.log(user);
              res.json({
                status: 200,
                code: 1,
                message: "register successfully",
                data: user
              });
            })
            .catch(err => console.log(err));
        });
      });
    };
  });
});

// @route   POST /users/login
router.post("/login", (req, res) => {
  passport.authenticate(
    "local",
    { session: false, failureRedirect: "/login" },
    (err, user) => {
      if (!user) {
        return res.redirect("/login");

      } else {
        jwt.sign({ user: user }, "StRoNGs3crE7", (err, token) => {
          if (err) {
            return res.redirect("/login");
          }
          console.log(token);
          res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: true
          });
          return res.redirect("/");
        }
        )
      }
    }
  )(req, res);
});

// @route   POST /users/logout
router.post("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.removeHeader("Cookie")
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

// @route   POST /users/forgotpassword
router.post("/forgotpassword", (req, res) => {
  const { errors, isValid } = validateForgotPasswordInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json({ data: {}, error: errors });
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true,
        auth: {
          user: 'ttsgroup4@gmail.com',
          pass: 'texttospeech'
        }
      });
      let tempPass = Math.random().toString(36).substring(3);
      console.log(tempPass);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(tempPass, salt, (err, hash) => {
          if (err) throw err;
          user.tempPassword = hash;
          User.findByIdAndUpdate(user._id, user, { new: true }, (err, doc) => {
            if (err) {
              errors.message = "System cannot progress right now";
              errors.code = 1050;
              return res.status(1050).json({ data: {}, error: errors });
            }

            var mail = {
              from: 'ttsgroup4@gmail.com',
              to: user.email,
              subject: 'Bạn vừa gửi một yêu cầu thay đổi mật khẩu',
              html: '<p>Xin chào ' + user.fullname + '</p>'
                + '<p>Bạn hoặc một ai đó vừa gửi yêu cầu thay đổi mật khẩu từ hệ thống website của TEXT TO SPEECH. Vui lòng đăng nhập mới mật khẩu tạm thời sau: </p>'
                + '<p><b>' + tempPass + '</b></p>'

                + '<b>Lưu ý:</b> <i>Nếu bạn không thực hiện yêu cầu này, thì bạn có thể yên tâm bỏ qua!</i>'
                + '<br>'
                + '<p>Trân trọng</p>'
                + '<p>TTS</p>'
            };

            transporter.sendMail(mail, function (error, info) {
              if (error) {
                console.log("Sending mail error: " + error);
                errors.message = "Sending mail fails !";
                errors.code = 1010;

                return res.redirect("/");
              } else {
                return res.redirect("/login");
              }
            });

          });
        });
      });

    } else {
      errors.message = "Email does not exist in our system !";
      errors.code = 1010;
      return res.status(400).json({ data: {}, error: errors });
    }
  });

});

// @route   POST /users/changeInfo
router.post("/changeInfo", (req, res, next) => {
  let body = req.body;
  let user = res.locals.user
  const { errors, isValid } = validateInfoInput(body);
  if (!isValid) {
    return next({
      status: 400,
      code: errors.code,
      message: errors.message
    })
  }
  User.findOne({ email: user.email }).then(user => {
    user.fullname = body.fullname;
    user.numberPhone = body.numberPhone;
    user.email = body.email;
    user.save()
    return res.redirect("/profile");
  })
  .catch(err => {
    return next({
      status: 500,
      code: -1,
      message: 'error finding user'
    })
  })
});

// @route   POST /users/changePassword
router.post("/changePassword", (req, res) => {
  const { errors, isValid } = validatePasswordInput(req.body);

  // Check Validation
  if (!isValid) {
    return next({
      status: 400,
      code: errors.code,
      message: errors.message
    })
  }
  let user = res.locals.user;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user.tempPass = "";
      User.findByIdAndUpdate(user._id, user, { new: true }, (err, doc) => { });
    });
  });

  return res.redirect("/profile");
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

router.get("/me", (req, res, next) => {
  console.log(res.locals.user);
  res.json(res.locals.user);
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
