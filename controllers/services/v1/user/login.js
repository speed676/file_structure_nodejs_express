/**
 * @api {post} /user/login login
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Si el usuario y contraseña son correctos devuelve un token que autoriza 
 * ha realizar las operaciones con el API (aquellas partes que la requieran).
 * 
 * Si el 'user' o 'pass' son incorrectos el servidor responde con un json de error.
 *
 * El token que se genera contiene únicamente el "userName" y el "role"
 * 
 * @apiParamExample				{json} Peticion:
 *    { 
 *      "user": "<userName>",
 *      "pass": "<password>" 
 *    }
 *                 
 * @apiSuccessExample			{json} Respuesta login correcto:
 *    HTTP/1.1 200 OK
 *    [{"data":
 *		{
 *		  "token": "",
 *		  "success": true
 *		}
 *	  }]
 *
 * @apiErrorExample				{json} Respuesta login incorrecto 
 *    HTTP/1.1 400 BadRequest
 *    [{"data": 
 *	    {
 *		  "message": "Usuario y/o contraseña incorrecto",
 *		  "success": false
 *	    }	
 *	  }]
 */

const log = require('simple-node-logger').createSimpleLogger('./utils/logger/log.txt');
const config = require('../../../../config/config.json');
const user = require(config.application_root+'/models/userSchema');
const secreto = config.SECRETO;
const conexionDB = config.CONEXION_DB;
const bcrypt = require('bcrypt');
const saltRounds = 10;

var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

let jsonLoginOk = 
				{"data": 
					{
						"token": null,
						"success": true
					}
				};
let jsonError = 
				{"data": 
					{
						"message": "Usuario y/o contraseña incorrecto",
						"success": false
					}	
				};
var jsonUsuario = 
				{"userName": "", "role": ""};


module.exports = {
	start: function(valores, callback){

		mongoose.connect(conexionDB);

		let reqUser = valores.user;
		let reqPass = valores.pass;
		let result = {};
		result.status = "400";
		result.data = jsonError;
		//log.info("valores: "+valores);
		
		user.findOne({'userName': reqUser}, function(error, userData) {
			if(error) {	
				log.warn("Error de conexion con la DB");
				mongoose.connection.close();
				callback(null, result);
			}
			else {
				// No existe el usuario
				if (!userData) {
					log.warn("No existe el usuario.");
					mongoose.connection.close();
					callback(null, result);
				}
				// Existe el usuario
				else {
					bcrypt.compare(reqPass, userData.password, function(error, resultCrypt) {
						// Contrasenya incorrecta
						if (resultCrypt == false) {
							log.warn("Contrasenya incorrecta.");
							mongoose.connection.close();
							callback(null, result);
						}
						// Contrasenya correcta
						else {
							jsonUsuario.userName = userData.userName;
							jsonUsuario.role = userData.role;

							// token de 1 hora de expiación
							token = jwt.sign({
								exp: Math.floor(Date.now() / 1000) + (60 * 60), 
								data: jsonUsuario
							}, secreto);

							jsonLoginOk.data.token = token;

							user.update({"_id": userData._id}, {$set:{"token": token}}, function (error) {
								if (error) {
									log.warn("Error al actualizar el token del usuario");
									mongoose.connection.close();
									callback(null, result);
								}
								else {
									log.info("Login correcto del usuario: "+jsonUsuario.userName);
									mongoose.connection.close();
									result.status = "200";
									result.data = jsonLoginOk;
									callback(null, result);
								}
							})
						}
					})
				}
			}
			
		});

	}
}
