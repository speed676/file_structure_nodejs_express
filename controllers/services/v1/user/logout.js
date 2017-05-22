/**
 * @api {post} /user/logout logout
 * @apiGroup User
 * @apiVersion 1.0.0
 * @apiDescription El usuario da la orden al sistema de que quiere desconectarse del sistema. 
 * 	Si la respuesta en un 500, el logout ha dado un error en el servidor.
 * 	Si la respuesta es un 200, el logout se ha realizado de forma satisfactoria.
 * 
 * @apiParamExample				{json} Peticion:
 *   {"data":
 *       {"token": <token>}
 *   }
 *                 
 * @apiSuccessExample			{json} Respuesta logout correcto:
 *    HTTP/1.1 200 OK
 *
 * @apiErrorExample				{vacio} Respuesta logout incorrecto 
 *    HTTP/1.1 500 ServerBad
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

module.exports = {
	start: function(valores, callback){
		
		let token = valores.token;
		let result = {};

		mongoose.connect(conexionDB);

		user.update({'userName': valores.userName}, {'token': "false"}, function (error) {
			if(error){
				log.warn("ERROR EN EL update de LOGOUT del usuario: "+valores.userName);
				result.status = "500";
				result.data = jsonError;
			}
			else {
				result.status = "200";
				result.data = "";
				log.info("LOGOUT del usuario: "+valores.userName);
			}
			
			mongoose.connection.close();
			callback(null, result);
		});
				
	}
}
