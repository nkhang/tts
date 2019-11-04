from flask import Flask, request, redirect, send_file, g
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
from werkzeug.utils import secure_filename
import os
from gtts import gTTS
from docx import Document

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

def getDocText(filename):
    doc = Document(filename)
    fullText = ""
    for para in doc.paragraphs:
        fullText += para.text
    return fullText
	
def textToSpeech(filenameInput, filenameOutput, language, prefixFilename):
    encoding = 'ansi'
    if language == "vi":
        encoding = 'utf8'

    myText = ''
    if prefixFilename == 'txt':
        with open(filenameInput, "r",  encoding = encoding) as fh:
            myText = fh.read().replace("\n", " ")
        fh.close()
    elif prefixFilename == 'docx':
        myText = getDocText(filenameInput).replace('\n',' ')
    
    output = gTTS(text = myText, lang = language, slow = False)
    output.save(filenameOutput)

@app.route('/upload', methods = ['POST'])
def upload_file():
	if 'file' not in request.files:
		errors = {'data': {}, 'error': {'message': 'invalid pagram', 'code': 300}}
		return jsonify(errors)
	f = request.files['file']
	
	if 'language' not in request.form:
		errors = {'data': {}, 'error': {'message': 'invalid pagram', 'code': 300}}
		return jsonify(errors)
	language = request.form['language']

	if f.filename == '':
		errors = {'data': {}, 'error': {'message': 'no file', 'code': 301}}
		return jsonify(errors)
	
	if f and allowed_file(f.filename):
		f.save(secure_filename(f.filename))
		
		perfix = f.filename.rsplit('.', 1)[1].lower()
		filename = f.filename.rsplit('.', 1)[0]
		filenameInput = f.filename
		filenameOutput = OUTPUT_FOLDER + filename + '.mp3'
		
		if not os.path.exists(OUTPUT_FOLDER):
			os.makedirs(OUTPUT_FOLDER)
			
		textToSpeech(filenameInput, filenameOutput, language, perfix)
		
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