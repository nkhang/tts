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



# import os, docx2txt
# def get_doc_text(filepath, file):
#     if file.endswith('.docx'):
#         text = docx2txt.process(file)
#         return text
#     elif file.endswith('.doc'):
#         # converting .doc to .docx
#         doc_file = filepath + file
#         docx_file = filepath + file + 'x'
#         print(docx_file)
#         if not os.path.exists(docx_file):
#             os.system('antiword ' + doc_file + ' > ' + docx_file)
#             with open(docx_file) as f:
#                 text = f.read()
#             os.remove(docx_file) #docx_file was just to read, so deleting
#         else:
#             # already a file with same name as doc exists having docx extension, 
#             # which means it is a different file, so we cant read it
#             print('Info : file with same name of doc exists having docx extension, so we cant read it')
#             text = ''
#         return text

# import PyPDF2
# pdf_file = open('text.pdf', 'r', encoding = 'utf-8')
# read_pdf = PyPDF2.PdfFileReader(pdf_file)
# number_of_pages = read_pdf.getNumPages()
# fullText = ''
# for i in range(number_of_pages):
#     page = read_pdf.getPage(i)
#     page_content = page.extractText().replace('\n', ' ')
#     fullText += page_content
# myText = fullText
# print(myText)
# output = gTTS(text = myText, lang = 'en', slow = False)
# output.save("text.mp3")

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