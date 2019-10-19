var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

//register
// @route   POST /users/register
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        numberPhone: req.body.numberPhone
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});


// @route   POST /users/login
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, fullname: user.fullname, email: user.email, numberPhone: user.numberPhone };

        res.json({
            success: true,
            user: payload
        });
        // // Sign Token
        // jwt.sign(
        //   payload,
        //   keys.secretOrKey,
        //   { expiresIn: 3600 },
        //   (err, token) => {
        //     res.json({
        //       success: true,
        //       token: 'Bearer ' + token
        //     });
        //   }
        // );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

/* GET users listing. */
router.post("/", async (req, res) => {
  try {
      var user = new User(req.body);
      var result = await user.save();
      res.send(result);
  } catch (error) {
      res.status(500).send(error);
  }
});

router.get("/", async (req, res) => {
  try {
      var result = await User.find().exec();
      res.send(result);
  } catch (error) {
      res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
      var user = await User.findById(req.params.id).exec();
      res.send(user);
  } catch (error) {
      res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
      var user = await User.findById(req.params.id).exec();
      user.set(req.body);
      var result = await user.save();
      res.send(result);
  } catch (error) {
      res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
      var result = await User.deleteOne({ _id: req.params.id }).exec();
      res.send(result);
  } catch (error) {
      res.status(500).send(error);
  }
});

module.exports = router;
