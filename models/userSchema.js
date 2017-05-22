var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	userName: 		{ 
						type: String,
						unique: true
					},
	password: 		{
						type: String,
						required: true
					},
	role: 			{type:String, enum: ['Admin', 'User', 'Business']},
	name: 			String,
	surname: 		String,
	businessName: 	String,
 	cif: 			String, // CIF-DNI
	address: 		String,
	email: 			String,
	phone: 			String,
	savedArticles: 	Array,
	token:          String, // True si hay que aceptar el token como bueno
	lastLogin:       {
						type: Date,
						// `Date.now()` returns the current unix timestamp as a number
						default: Date.now
					},
	dateCreate:     Date
})

module.exports = mongoose.model('user', userSchema);