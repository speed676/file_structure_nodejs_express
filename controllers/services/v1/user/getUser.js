/**
 * @api {get} /user/:userName?token=<token> getUser
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription Recupera la informacion de un usuario. 
 * 
 * @apiParam {String} token Peticion con el QueryString el campo 'token' con el token generado en la peticion de login.
 *                 
 * @apiSuccessExample			{json} Respuesta getUser correcto:
 *    HTTP/1.1 200 OK
 *    [{
 *         "name": "name",
 *         "email": "example@uji.es",
 *         "cif": "23456798M",
 *         "address": "Calle falsa 123",
 *         "phone": "687687487"
 *    }]
 *
 * @apiErrorExample				{json} Respuesta getUser incorrecto 
 *    HTTP/1.1 400 BadRequest
 *    [{"data": 
 *	    {
 *          "message": "Error en la peticion",
 *      }	
 *    }]
 */

const log = require('simple-node-logger').createSimpleLogger('./utils/logger/log.txt');
const config = require('../../../../config/config.json');
const user = require(config.application_root+'/models/userSchema');
const secreto = config.SECRETO;
const conexionDB = config.CONEXION_DB;

var mongoose = require('mongoose');

let jsonError = {"data":
					{
						"message": "Error en la petición"
					}
				};
var jsonGetUser = {
	"name": "",
	"email": "",
	"cif": "",	
	"address": "",
	"phone": "",
	"businessName": ""
};

module.exports = {
	start: function(valores, callback){
		
		let userName = valores.userName;
		let result = {};
		result.status = "400";
		result.data = jsonError;

		mongoose.connect(conexionDB);

		user.findOne({'userName': userName}, function(error, userDato) {
			if(error) {	
				log.warn("ERROR en GETUSER con el usuario: "+userName)
			}
			else {
				if (!userDato) {
					log.warn("No existe el usuario.");
					jsonError.data.message = "Usuario no encontrado.";
				}
				else {
					
					jsonGetUser.name = userDato.userName;
					jsonGetUser.email = userDato.email;
					jsonGetUser.cif	= userDato.cif;
					jsonGetUser.address = userDato.address;
					jsonGetUser.phone = userDato.phone;
					jsonGetUser.businessName = userDato.businessName;

					log.info("GETUSER del usuario: "+userName);
					result.status = "200";
					result.data = jsonGetUser;
				}
			}

			mongoose.connection.close();
			callback(null, result);
		});
				
	}
}
