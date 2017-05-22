// TODO don't use in real proyects

# File structure for node.js with express

#### File structure in node, with:

* Login with JWT (json web tokens)
* Simple logger
* Simple and functional structure
* Simple documentation generator (1 command with 'apidoc')
* NoSQL DB (mongoose)

# PROJECT STRUCTURE
--------------------------------------------------------------------------------------------------------
	/config ->Aquellas cosas que necesitemos guardar importantes (cadenas de conexión a bd, claves, etc)

	/controllers ->Controladores de nuestro proyecto (responsabilidad de control de entrada de datos)
		/services ->Funcionalidad del servicio web. Código de acceso y tratamiento de datos
			/v1 -> Versión del API de esos ficheros
				/user ->Carpeta con las funcionalidades de "user"

	/models ->Modelos, ficheros que tratan el acceso a la bd

	/node_modules ->Ficheros de nuestras dependencias

	/public ->Recursos estáticos de nuestro proyecto
		/vendors ->Librerías externas para todas las distintas páginas html
		/web -> Aquí recursos del back-end propios e importantes
			/css
			/img
			/js

	/template ->Plantilla HTML para autogenerar la web de la documentación

	/test ->El lugar para que pruebes tus test

	/utils ->Utilidades necesarias para el trabajo (por ejemplo el logger)

	/views ->Vistas HTML de nuestro back-end

	app.js ->Punto de arranque de todo el proyecto
	package.json ->Dependencias NPM del proyecto
	.gitignore ->Rutas que queremos que GIT ignore y no les haga commit (cache, log, etc)
	apidoc.json ->Fichero de aspectos de generales para generar la documentación
-------------------------------------------------------------------------------------------------------

# PASOS PARA ARRANCAR EL PROYECTO

1. Abre la consola de NODE y la consola de GIT
2. Haz git pull o clone si es la primera vez (que pueden haber cambios)
3. Crea la carpeta "logger" si no se ha creado sola dentro de la carpeta "utils" (aquí te apareceran los logs)
4. En la consola escribe "npm install"
5. En la consola escribe "node .\app.js"
6. Arranca en [http://localhost:8080/](http://localhost:8080/)
 6.a Error sobre log: Crea la carpeta 'logger' en /utils
7. Para ver la documentación abre [http://localhost:8080/documentation](http://localhost:8080/documentation)

NOTAS: 

1. Para crear la documentación usa el comando desde la raíz del proyecto: apidoc -i controllers/services/v1/ -o documentation -t template/
2. Pasos 4 y 5 se pueden hacer a la vez ejecutando "npm start"
3. El proyecto esta subido en [OpenShift](http://tenderbot-tenderbot.1d35.starter-us-east-1.openshiftapps.com)

------------------------------------------------------------------------------------------------------

## VALIDAR PETICIONES QUE NECESITEN AUTORIZACIÓN
```javascript
// Incluye la libreria
var jwt = require('jsonwebtoken');

//Comprueba que el token sea bueno
jwt.verify(token , secreto, function(err, decoded){
	if(err){
		// respond to request with error
	}else{
		// continue with the request
		// Para acceder a la info del token:
		decoded.data.userName;
		// o
		decoded.data.role;
	}
});
```
-> Si se ha cumplido estas comprobaciones, puedes autorizar la operación


-------------------------------------------------------------------------------------------------------

## RECOGER DATOS SENSIBLES
* (Secreto y conexión a la base de datos)
* La información está en el fichero /config/config.json en formato JSON, para recogerla y usarla en el código hacer lo siguiente:

```javascript
// Cargar el JSON:
const config = require('../config/config.json');

// Acceder a los datos del JSON
const secreto = config.SECRETO;
const conexionDB = config.CONEXION_DB;
```

-------------------------------------------------------------------------------------------------------

## Back-end

Acceso al back-end:

1. Abre un navegador (chrome o firefox, no me seas cutre y uses safari o edge tio :/)
2. Abre la ruta al servidor, por ejemplo [http://localhost:8080/login](http://localhost:8080/login)
3. Te cargará la pantalla del login, puedes usar el __user__: **"platano"**, __contraseña__: **"barato"**
4. Ale, a disfrutar del back-end :)

------------------------------------------------------------------------------------------------------

## USAR FICHERO LOG EN EL PROYECTO:

* Si no tienes la carpeta /utils/logger creala

```javascript
//Crear variable para tener disponible el log en mi código
const log = require('simple-node-logger').createSimpleLogger('./utils/logger/log.txt');

//Escribe el mensaje que pongas
log.info('Ejemplo 22222222222'); //Para mensajes de info
log.warn('Ejemplo de mensaje de alerta'); //Para mensajes de alerta (WARNING)

//Ahora, tienes esos mensajes en la consola y en el fichero /utils/logger/log.txt
```

-------------------------------------------------------------------------------------------------------

## AÑADIR/MODIFICAR/QUITAR DOCUMENTACIÓN

En los ficheros de las carpetas /controllers/services/vX/user|articulo|categoria está el código únicamente para poder
 realizar la funcionalidad esa en concreto y arriba del todo su "código" de etiquetas para que pueda generar la documentación.

* La documentación ha sido generada con la libreria [http://apidocjs.com](http://apidocjs.com)
* Para poder ver los parámetros que puedes usar entra aquí: [http://apidocjs.com/#params](http://apidocjs.com/#params)

Como podrás comprobar en los ficheros de la carpeta /user#login#logout#getUser#signup al comienzo del fichero esta la documentación. 
 Puedes copiar de ahi un ejemplo y usarlo en tus ficheros para luego modificarlo, eso si, ASEGURATE QUE ES TODO ESCRITO CORRECTAMENTE.

