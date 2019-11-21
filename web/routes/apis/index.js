const express = require("express");
const router = express.Router();
const passport = require("passport");
const authmdw = require('../../middlewares/auth.mdw');
const userRouter = require("./user/users");
const ttsRouter = require("./tts/tts");

passport.initialize();

router.use("/users", userRouter);
router.use(
  "/tts",
  ttsRouter
);

module.exports = router;
