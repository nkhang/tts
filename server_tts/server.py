from flask import Flask, request, redirect, send_file, g
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
from werkzeug.utils import secure_filename
import os
from gtts import gTTS

UPLOAD_FOLDER = 'uploads\\'
OUTPUT_FOLDER = 'outputs\\'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
api = Api(app)
		
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
		filenameOutput = OUTPUT_FOLDER + filename + '.mp3'
		
		if not os.path.exists(OUTPUT_FOLDER):
			os.makedirs(OUTPUT_FOLDER)
			
		textToSpeech(content, filenameOutput, language, perfix)
		
		if os.path.exists(filenameInput):
			os.remove(filenameInput)
		res = {'data': {'url': filenameOutput}, 'error': {}}
		return jsonify(res)
	errors = {'data': {}, 'error': {'message': 'conversion failed', 'code': 302}}
	return jsonify(errors)

api.add_resource(TTS, '/tts')

if __name__ == '__main__':
    app.run(
		host="localhost",
		port=5000
	)