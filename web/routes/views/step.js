var express = require("express");
var router = express.Router();
var Registration = require('../../models/Registration');
var uuidv4 = require('uuid/v4');

require("../../db");
const User = require("../../models/User");
const Invoice = require("../../models/Invoice");
const Service = require("../../models/Service");
var nodemailer = require('nodemailer');
const validatePurchaseInput = require("../../validation/purchase");

router.post("/purchase", (req, res, next) => {
  const { errors, isValid } = validatePurchaseInput(req.body);
  // Check Validation
  if (!isValid) {
    return next({
      status: 400,
      code: errors.code,
      message: errors.message
    });
  }

  let invoice = new Invoice();
  invoice.fullname = req.body.fullname;
  invoice.email = req.body.email;
  invoice.numberPhone = req.body.numberPhone;
  invoice.package = req.body.package;
  invoice.cardName = req.body.cardName;
  invoice.cardNumber = req.body.cardNumber;
  invoice.expire = new Date(req.body.expyear + "-" + req.body.expmonth + "-28");
  invoice.cvv = req.body.cvv;

  if (invoice.expire.getMonth() !== new Date().getMonth() || invoice.expire.getYear() !== new Date().getYear())
    if (invoice.expire - new Date() < 0) {
      return next({
        status: 400,
        code: 1015,
        message: "Card is expired !"
      });
    }

  let key = "";
  if (res.locals.user.purchased) {
    key = res.locals.user.key;
    Service.findOne({ key: key }).then(service => {
      service.extendDueTime(req.body.package);
      Service.findByIdAndUpdate(service._id, service, { new: true }, (err, doc) => {});
    }).catch(err => console.log(err));
    
  } else { // new package
    key = (res.locals.user._id).toString().substr(0, 15);
    let service = Service.getSampleService(req.body.package);
    service.key = key;
    if (res.locals.user.key) {
      Service.findOneAndDelete({ key: key }).then(p => {
        service.save(); 
      }).catch(err => console.log(err));
    } else {
      service.save();
    }
  }
  console.log(key);
  invoice.save();
  let keyString = key.slice(0,5) + '-' + key.slice(5,10) + '-' + key.slice(10);
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
  var mail;
  if (res.locals.user.purchased) {
    mail = {
      from: 'ttsgroup4@gmail.com',
      to: res.locals.user.email,
      subject: 'Cảm ơn bạn đã mua sản phẩm',
      html: '<p>Xin chào ' + res.locals.user.fullname + '</p>'
        + '<p>Cảm ơn bạn đã gia hạn gói dịch vụ TEXT TO SPEECH của chúng tôi. Key truy cập API của bạn: </p>'
        + '<p><b>' + keyString + '</b></p>'
        + '<p>Để quản lý dịch vụ cũng như tìm hiểu cách sử dụng, xin vui lòng truy cập trang web của chúng tôi.</p>'
        + '<br>'
        + '<p>Trân trọng</p>'
        + '<p>TTS</p>'
    };
   
  } else {
    mail = {
      from: 'ttsgroup4@gmail.com',
      to: res.locals.user.email,
      subject: 'Cảm ơn bạn đã mua sản phẩm',
      html: '<p>Xin chào ' + res.locals.user.fullname + '</p>'
        + '<p>Cảm ơn bạn đã mua gói dịch vụ TEXT TO SPEECH của chúng tôi. Đây là key dùng để truy cập API: </p>'
        + '<p><b>' + keyString + '</b></p>'
        + '<p>Để quản lý dịch vụ cũng như tìm hiểu cách sử dụng, xin vui lòng truy cập trang web của chúng tôi.</p>'
        + '<br>'
        + '<p>Trân trọng</p>'
        + '<p>TTS</p>'
    };

    let user = res.locals.user;
    user.key = key;
    user.purchased = true;
    User.findByIdAndUpdate(user._id, user, { new: true }, (err, doc) => {});
  }

  transporter.sendMail(mail, function (error, info) {
    if (error) {
      console.log("Sending mail error: " + error);
      errors.message = "Sending mail fails !";
      errors.code = 1010;

      return res.redirect("/prices");
    } else {
      return res.redirect("/service");
    }
  });

});

router.get("/activateFree", (req, res, next) => {
  if (!res.locals.user || res.locals.user.purchased) {
    return res.redirect("/prices");
  }
  
  key = (res.locals.user._id).toString().substr(0, 15);
  let service = Service.getSampleService(0);
  service.key = key;
  service.save();
  console.log(key);
  let keyString = key.slice(0,5) + '-' + key.slice(5,10) + '-' + key.slice(10);
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
  let mail = {
      from: 'ttsgroup4@gmail.com',
      to: res.locals.user.email,
      subject: 'Cảm ơn bạn đã đăng ký dùng thử dịch vụ',
      html: '<p>Xin chào ' + res.locals.user.fullname + '</p>'
        + '<p>Cảm ơn bạn đã đăng ký dùng thử dịch vụ của TEXT TO SPEECH chúng tôi. Đây là key dùng để truy cập API: </p>'
        + '<p><b>' + keyString + '</b></p>'
        + '<p>Để quản lý dịch vụ cũng như tìm hiểu cách sử dụng, xin vui lòng truy cập trang web của chúng tôi.</p>'
        + '<br>'
        + '<p>Trân trọng</p>'
        + '<p>TTS</p>'
  };

  let user = res.locals.user;
  User.findOne({ email: user.email }).then(user => {
    user.key = key;
    user.save();
  }).catch(err => {
    return next({
      status: 500,
      code: -1,
      message: 'error finding user'
    });
  });

  transporter.sendMail(mail, function (error, info) {
    if (error) {
      console.log("Sending mail error: " + error);
      errors.message = "Sending mail fails !";
      errors.code = 1010;

      return res.redirect("/prices");
    } else {
      return res.redirect("/howToUse");
    }
  });

});

router.get("/information", (req, res, next) => {
    var service = req.query.service
    var level = 0;
    console.log(service)
    switch (service) {
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
        level: body.service,
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