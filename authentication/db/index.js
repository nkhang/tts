var mongoose = require('mongoose');

const mlabURI = 'mongodb+srv://mydb:texttospeech@cluster0-r2eia.mongodb.net/test?retryWrites=true&w=majority' 
const connection = mongoose.connect(mlabURI,{ useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
	if(error){
		console.log("Error " + error);
	}else{
		console.log("Connected successfully to server nhut")
	}
});

module.exports = connection;
