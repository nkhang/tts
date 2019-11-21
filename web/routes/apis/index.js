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

router.use((err, req, res, next) => {
  var resp = {}
  res.status(err.status || 500)
  resp.status = err.code
  resp.message = err.message
  if (err.data) {
      resp.data = data
  }
  res.json(resp)
})
module.exports = router;
