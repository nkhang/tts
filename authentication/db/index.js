var mongoose = require('mongoose');

const mlabURI = 'mongodb+srv://mydb:nhutkk259758@cluster0-tzdhi.mongodb.net/test?retryWrites=true&w=majority'

const con = mongoose.connect(mlabURI,{ useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
	if(error){
		console.log("Error " + error);
	}else{
		console.log("Connected successfully to server nhut")
	}
});

module.exports = con;