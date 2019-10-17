var express = require('express');
var router = express.Router();
let multer = require("multer");
let path = require("path");

let uploads = "uploads"
let outputs = "outputs"
let language = 'vi'

let diskStorage = multer.diskStorage({
    destination: (req, file, callback) => {
      let dir = __dirname.slice(0, __dirname.lastIndexOf("\\"))
      let folderUpload = path.join(`${dir}/${uploads}`)
      callback(null, folderUpload);
    },
    filename: (req, file, callback) => {
      let math = ["text/plain", "application/msword", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

      if (math.indexOf(file.mimetype) === -1) {
        let errorMess = `The file <strong>${file.mimetype}</strong> is invalid. Only allowed to upload image jpeg or png.`;
        return callback(errorMess, null);
      }

      let filename = file.originalname;
      callback(null, filename);
    }
  });

let uploadFile = multer({storage: diskStorage}).single("file");

router.post("/upload", (req, res) => {
  uploadFile(req, res, (error) => {
    if (error) {
      return res.send(`Error when trying to upload: ${error}`);
    }
    
    
    let dir = __dirname.slice(0, __dirname.lastIndexOf("\\"))
    let filenameInput = path.join(`${dir}/${uploads}/${req.file.filename}`)
    var prefixFilename = filenameInput.slice(filenameInput.length - 4, filenameInput.length)
    var name = req.file.filename.slice(0, req.file.filename.length - 4) + "mp3"

    if (prefixFilename[0] == '.') {
      prefixFilename = filenameInput.slice(filenameInput.length - 3, filenameInput.length)
      name = req.file.filename.slice(0, req.file.filename.length - 3) + "mp3"
    }
    
    let filenameOutput = path.join(`${dir}/${outputs}/${name}`)

    call_TTS(filenameInput, filenameOutput, language, res, prefixFilename)
  });
});

function call_TTS(filenameInput, filenameOutput, language, res, prefixFilename) {
  var { spawn } = require('child_process');

  var process = spawn('python', 
                      [path.join(`${__dirname}/textToSpeech.py`),
                        filenameInput, 
                        filenameOutput,
                        language,
                        prefixFilename
                      ]);
  
  process.stdout.on('data', (data) => {
    res.sendFile(filenameOutput)
    console.log(`stdout: ${data}`);
  });
  process.stderr.on('data', (data) => {
    res.send(data.toString());
    console.log(`stderr: ${data}`);
  });
}

module.exports = router;