var express = require("express");
var router = express.Router();
let multer = require("multer");
let path = require("path");
var request = require('request');
var textract = require('textract');
var pdfUtil = require('pdf-to-text');

let uploads = "uploads";
let outputs = "outputs";
let language = "vi";
let TTS_HOST = 'http://wordspeechapi.herokuapp.com/'
let urlUploadFile = `${TTS_HOST}upload`;
let urlGetFile = `${TTS_HOST}tts`;
const Service = require("../../../models/Service");

let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    let dir = __dirname.slice(0, __dirname.lastIndexOf("\\"));
    let folderUpload = path.join(`${dir}/${uploads}`);
    callback(null, folderUpload);
  },
  filename: (req, file, callback) => {
    let math = [
      "text/plain",
      "application/msword",
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.mimetype}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }

    let filename = file.originalname;
    callback(null, filename);
  }
});

let uploadFile = multer({ storage: diskStorage }).single("file");

router.post("/uploadFile", async (req, res) => {

  uploadFile(req, res, error => {
    if (error) {
      let errors = {'data': {}, 'error': {'message': `Error when trying to upload: ${error}`, 'code': 303}}
      return res.send(errors);
    }

    let mimetype = req.file.mimetype
    let path = req.file.path

    if (mimetype === 'application/pdf') {
      pdfUtil.info(path, function(error, text) {
        if (error) {
          let errors = {'data': {}, 'error': {'message': `Error when trying to read: ${error}`, 'code': 304}}
          res.send(errors)
        }

        checkKeyTTS(req.headers, text, res, function() {
          sendData(req.headers, text, language, req.file.filename, res)
        })
      });
    } else {
      textract.fromFileWithMimeAndPath(mimetype, path, function (error, text) {
        if (error == null) {
          checkKeyTTS(req.headers, text, res, function() {
            sendData(req.headers, text, language, req.file.filename, res)
          })
        } else {
          let errors = {'data': {}, 'error': {'message': `Error when trying to read: ${error}`, 'code': 305}}
          res.send(errors)
        }
      })
    }
  });
});

router.post("/uploadText", async (req, res) => {
  if (req.body.content.length == 0) {
    let errors = {'data': {}, 'error': {'message': `Error when trying to upload: ${error}`, 'code': 303}}
    res.send(errors)
  } 

  checkKeyTTS(req.headers, req.body.content, res, function() {
    let ts = Date.now()
    sendData(req.headers, req.body.content, language, `tts_${ts}_${req.body.content.length}.txt`, res)
  })
});

function sendData(headers, content, language, filename, res) {
  const options = {
    content : content,
    language: language,
    filename: filename
  }
  
  request({
    method: 'POST',
    url: urlUploadFile,
    json: options
  }, (error, response, body) => {
    console.log(body, error)
      if (error) {
        let errors = {data: {}, error: {message: `Error when translate: ${error}`, code: 305}}
        res.send(errors)
      }

      if (headers.key == undefined || headers.key == null) {
        console.log("-------translate free-----")
      } else {
        //update service
        Service.findOne({ key: headers.key }).then(service => {
          service.numberUse = service.numberUse + content.length;
          service.numberChar = service.numberChar - content.length;
          service.updateAt = Date()
          console.log(service)
          console.log("updateAt", service.updateAt.toString())
          service.save()
        }).catch(err => {
          console.log(err)
        })
      }

      res.send(body);
  });
}

function checkKeyTTS(headers, content, res, callback) {
  if (headers.key == undefined || headers.key == null) {
    defindErrorCheckKey(306, res)
  } else {
    console.log(headers.key)
    Service.findOne({ key: headers.key }).then(service => {
      console.log(service)
      Service.findOne({ key: headers.key, dueDate: { $gte: Date() } }).then(service => {      
        if (service.numberChar != null && service.numberChar < content.length) {
          defindErrorCheckKey(309, res)
        }

        callback()
      }).catch(err =>{
        defindErrorCheckKey(308, res)
      })
    }).catch(err => {
      defindErrorCheckKey(307, res)
    })
  }
}

function defindErrorCheckKey(code, res) {
  let message = ""
    switch (code) {
      case 306: message = "key undefined"; break;
      case 307: message = 'key not found'; break;
      case 308: message = 'your key has expired'; break;
      case 309: message = 'your server not enough characters, you need to buy more'; break;
    }

    res.send({ data: {}, error: {message: message, code: code} });
}

router.get("/hello", (req, res, next) => {
  res.send("hello");
});

router.post("/uploadFileFree", async (req, res) => {

  uploadFile(req, res, error => {
    if (error) {
      let errors = {'data': {}, 'error': {'message': `Error when trying to upload: ${error}`, 'code': 303}}
      return res.send(errors);
    }

    let mimetype = req.file.mimetype
    let path = req.file.path

    if (mimetype === 'application/pdf') {
      pdfUtil.info(path, function(error, text) {
        if (error) {
          let errors = {'data': {}, 'error': {'message': `Error when trying to read: ${error}`, 'code': 304}}
          res.send(errors)
        }

        sendData(req.headers, text, language, req.file.filename, res)
      });
    } else {
      textract.fromFileWithMimeAndPath(mimetype, path, function (error, text) {
        if (error == null) {
          sendData(req.headers, text, language, req.file.filename, res)
        } else {
          let errors = {'data': {}, 'error': {'message': `Error when trying to read: ${error}`, 'code': 305}}
          res.send(errors)
        }
      })
    }
  });
});

router.post("/uploadTextFree", async (req, res) => {
  if (req.body.content.length == 0) {
    let errors = {'data': {}, 'error': {'message': `Error when trying to upload: ${error}`, 'code': 303}}
    res.send(errors)
  } 

  let ts = Date.now()
  sendData(req.headers, req.body.content, language, `tts_${ts}_${req.body.content.length}.txt`, res)
});

module.exports = router;
