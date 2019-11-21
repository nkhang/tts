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
let urlUploadFile = "http://localhost:5000/upload";
let urlGetFile = "http://localhost:5000/tts";

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
      pdfUtil.info(path, function(error, info) {
        if (error) {
          let errors = {'data': {}, 'error': {'message': `Error when trying to read: ${error}`, 'code': 304}}
          res.send(errors)
        }
        sendData(info, language, req.file.filename)
      });
    } else {
      textract.fromFileWithMimeAndPath(mimetype, path, function (error, text) {
        if (error == null) {
          sendData(text, language, req.file.filename, res)
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
  sendData(req.body.content, language, `file${req.body.content.length}.txt`, res)
});

function sendData(content, language, filename, res) {
  const options = {
    content : content,
    language: language,
    filename: filename
  }
  console.log(options)
  request({
    method: 'POST',
    url: urlUploadFile,
    json: options
  }, (error, response, body) => {
    console.log(body, error)
      if (error) {
        let errors = {'data': {}, 'error': {'message': `Error when translate: ${error}`, 'code': 305}}
        res.send(errors)
      }
     
      request({
        method: 'POST',
        url: urlGetFile,
        json: body.data
      }, (error, response, body) => {
        if (error) {
          let errors = {'data': {}, 'error': {'message': `Error when get file: ${error}`, 'code': 306}}
          res.send(errors)
        }
          res.send(body)
      });
  });
}

router.get("/hello", (req, res, next) => {
  res.send("hello");
});

module.exports = router;
