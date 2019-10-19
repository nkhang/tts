from gtts import gTTS 
import os
import sys
from docx import Document

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
    
    results = {
        'filename' : filenameOutput
    }
    
    print(str(results))
    sys.stdout.flush()
        
textToSpeech(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
