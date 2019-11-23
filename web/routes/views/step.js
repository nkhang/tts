var express = require("express");
var router = express.Router();
var Registration = require('../../models/Registration');
var uuidv4 = require('uuid/v4');

router.get("/information", (req, res, next) => {
    var pack = req.query.pack
    var level = 0;
    console.log(pack)
    switch (pack) {
      case "normal":
        break;
      case "super": {
        level = 1;
        break;
      }
      case "ultra": {
        level = 2;
        break;
      }
      default:
        break;
    }
    console.log(level)
    res.render("step1", { level: level });
  });

  router.post("/information", (req,res, next) => {
      var body = req.body
      console.log("body", body)
      const reg = new Registration({
        user_id: res.locals.user._id,
        level: body.pack,
        token: uuidv4()
      })
      reg.save().then(document => {
        console.log(document);
      }).catch(err => {
        console.log(err);
      })
      console.log("reg: ", reg);
      res.redirect("/step/payment")
  })
  
  router.get("/payment", (req, res, next) => {
    res.render("step2");
  });
  
  router.get("/confirmation", (req, res, next) => {
    res.render("step3");
  });

  module.exports = router;