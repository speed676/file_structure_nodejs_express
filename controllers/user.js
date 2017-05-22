// app.post('/user', user.login);
// app.post('/user/logout', user.logout);
// app.get('/user/:id', user.getUser);
const log = require('simple-node-logger').createSimpleLogger('./utils/logger/log.txt');
const config = require('../config/config.json');
const user = require('../models/userSchema');
const secreto = config.SECRETO;
const conexionDB = config.CONEXION_DB;

let jwt = require('jsonwebtoken');

let jsonError = {"data":
{"message": "Faltan campos por rellenar."}
};

// backdate a jwt 30 seconds (hacer que sea valido durante un X tiempo determinado, luego se autoinvalida)
// var older_token = jwt.sign({ foo: 'bar', iat: Math.floor(Date.now() / 1000) - 30 }, 'shhhhh');

module.exports = {
	
	login: function (req, res) {

		let entrada = undefined;

		// Comprobación datos de entrada:
		if (req.body !== undefined && req.body.user !== undefined && req.body.pass !== undefined) {
			entrada = {
				"user": req.body.user.replace(/[^a-zA-Z 0-9.]+/g, ''),
				"pass": req.body.pass.replace(/[^a-zA-Z 0-9.]+/g, '')
			};
		}

		// Si los datos de entrada son correctos ejecuto el servicio del login:
		if (entrada !== undefined) {
			let call = require('./services/v1/user/login');

			call.start(entrada, function(err, data){		
				setTimeout(function() { 
					res.status(data.status).send(data.data);
				}, 1500);
			});
		}else{
			log.warn("LOGIN FAIL (falta el user o pass)") // bar
			res.status(400).send(jsonError);
		}
	},

	logout: function (req, res) {

		var token = undefined;
		if (req.body !== undefined && req.body.data !== undefined) {
			token = req.body.data.token;
			var entrada = {
				"userName": ""
			};
		}

		// Verificamos el token
		if (typeof token !== undefined && token !== null) {

			jwt.verify(token , secreto, function(error, decoded) {
				if(error) {
					log.warn("LOGOUT con token erroneo o caducado") // bar
					res.status(400).send(jsonError);
				} 
				else {

					let call = require('./services/v1/user/logout');

					entrada.userName = decoded.data.userName;
					call.start(entrada, function(err, data){		
						res.status(data.status).send(data.data);
					});
				}
			});
		}
	},

	getUser: function (req, res) {
		
		let token = undefined;
		let usuario = undefined;
		let entrada;

		if (req.params !== undefined && req.params.user !== undefined && req.query.token !== undefined) {
			token = req.query.token;
			usuario = req.params.user.replace(/[^a-zA-Z 0-9.]+/g, '');
			entrada = {
				"userName": ""
			};
		}

		if (typeof token !== undefined && token !== null && usuario !== undefined) {
			// Verificamos el token
			jwt.verify(token , secreto, function(error, decoded){
				if(error){
					// respond to request with error
					log.warn("GETUSER con token erroneo o caducado") // bar
					res.status(400).send(jsonError);
				}
				else {
					//continue with the request
					if(usuario === decoded.data.userName || decoded.data.role === "Admin") { //no sirve de mucho, puede eliminarse el /user/:id por /user con el token
						
						let call = require('./services/v1/user/getUser');

						entrada.userName = decoded.data.userName;
						call.start(entrada, function(err, data){		
							res.status(data.status).send(data.data);
						});

					}
					else {
						log.warn("GetUser con usuario distinto de userName del token");
						res.status(400).send(jsonError);
					}
				}
			});
		} 
		else {

			log.warn("Petición a /user/:id sin token");
			res.status(400).send(jsonError);
		}
	}
};