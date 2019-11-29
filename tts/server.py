from flask import Flask, request, redirect, send_file, g
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
from werkzeug.utils import secure_filename
import os
from gtts import gTTS
import cloudinary
import cloudinary.uploader
import cloudinary.api

OUTPUT_FOLDER = '\\outputs\\'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

app = Flask(__name__)
api = Api(app)
cloudinary.config( 
  cloud_name = "dwhta0afh", 
  api_key = "352529278895127", 
  api_secret = "k_PqUtZjkL_oUM0dY-rBI5Z2FRY" 
)
		
class TTS(Resource):
    def post(self):
        result = request.get_json()
        filenameOutput = result['url']
        return send_file(filenameOutput)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def textToSpeech(content, filenameOutput, language, prefixFilename):
    output = gTTS(text = content, lang = language, slow = False)
    output.save(filenameOutput)

@app.route('/upload', methods = ['POST'])
def upload_file():
	result = request.get_json()
	ffilename = result['filename']
	language = result['language']
	content = result['content']

	if not ffilename:
		errors = {'data': {}, 'error': {'message': 'invalid pagram', 'code': 300}}
		return jsonify(errors)

	if allowed_file(ffilename):
		perfix = ffilename.rsplit('.', 1)[1].lower()
		filename = ffilename.rsplit('.', 1)[0]
		filenameInput = ffilename
		filenameOutput = os.getcwd() + OUTPUT_FOLDER + filename + '.mp3'
		
		if not os.path.exists(OUTPUT_FOLDER):
			os.makedirs(OUTPUT_FOLDER)
			
		textToSpeech(content, filenameOutput, language, perfix)
		
		if os.path.exists(filenameInput):
			os.remove(filenameInput)
		
		response = cloudinary.uploader.upload(filenameOutput,  folder = "audioTTS/", public_id = filename + ".mp3", overwrite = 'true',  resource_type = "raw")
		res = {'data': {'file': response, 'filename': filenameInput}, 'error': {}}
		return jsonify(res)
	errors = {'data': {}, 'error': {'message': 'conversion failed', 'code': 302}}
	return jsonify(errors)

api.add_resource(TTS, '/tts')

port = os.getenv('PORT')
if not port:
	port = 5000

if __name__ == '__main__':
    app.run(
		host="localhost",
		port=port
	)