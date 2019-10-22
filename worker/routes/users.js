var express = require('express');
var router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateLogoutInput = require('../validation/logout');
const tokenLength = 15
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
      errors.message = 'Email already exists';
      errors.code = 1010;
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        numberPhone: req.body.numberPhone,
        token : makeid(tokenLength)
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

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
      errors.message = 'User not found';
      errors.code = 1011;
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        user.token = makeid(tokenLength);
        user.save().then(user => {
            const dataUser = { id: user.id, fullname: user.fullname, email: user.email, numberPhone: user.numberPhone, token: user.token };
  
            res.json({
                success: true,
                user: dataUser
            });
        }).catch(err => console.log(err));
      } else {
        errors.message = 'Password incorrect';
        errors.code = 1012;
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   POST /users/logout
router.post('/logout', (req, res) => {
  const { errors, isValid } = validateLogoutInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const id = req.body.id;

  // Find user by id
  User.findById(id).exec().then(user => {
    // Check for user
    if (!user) {
      errors.message = 'User not found';
      errors.code = 1011;
      return res.status(404).json(errors);
    }

    user.token = " ";
    user.save().then(user => {
        res.json({
            success: true,
            user: {}
        });
    }).catch(err => console.log(err));
  });
});


// @route   POST /users/logout
router.post('/checkToken', (req, res) => {
  const { errors, isValid } = validateLogoutInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const id = req.body.id;
  const token = req.body.token;

  // Find user by id
  User.findById(id).exec().then(user => {
    // Check for user
    if (!user) {
      errors.message = 'User not found';
      errors.code = 1011;
      return res.status(404).json(errors);
    }

    if (user.token === token) {
      res.json({ result: true });
    } else {
      res.json({ result: false });
    }
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
