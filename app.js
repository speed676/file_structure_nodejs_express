const application_root=__dirname,
    express = require("express"),
    path = require("path"),
    bodyparser=require("body-parser");

//const db=require('./models/myStorage');  //utilizar directamente mongoose para tratar con mongoDB

var config = require('./config/config.json');
config.application_root = application_root;
// Importamos los controladores
var articulo = require('./controllers/articulo');
var categoria = require('./controllers/categoria');
var user = require('./controllers/user');

var app = express(); //Tewmporalemte comentado -->Alex
 
//Codigo del servidor -->Alex
// var app = express.createServer(express.logger()); //-->Alex

app.use(express.static(path.join(application_root,"views")));
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

//Cross-domain headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Acceso a los recursos publicos y a los recursos custom de la web
app.use(express.static(application_root + '/public'));
app.use(express.static(application_root + '/public/web'));
app.use(express.static(application_root + '/documentation'));


//var DB = new myDB('./data');

// app.get('/',function(req,res){
//     res.sendFile("views/index.html",{root:application_root});
// });

//----------------------------------------------------------------
//API documentation:
//https://docs.google.com/document/d/1fGD3fqVpBDxcUPT0fGyTl3AyLmueCZrSpm_Izz6hXo8/edit?usp=sharing
/*
  ----------DOCUMENTATION------------
*/
app.get('/documentation', function(req, res){
    res.sendFile("documentation/index.html", {root:application_root});
});


/*
	-----------USER------------
*/
app.post('/user/login', user.login);
app.post('/user/signup', user.signup);
app.post('/user/logout', user.logout);
app.get('/user/:user', user.getUser);

/*
	-----------CATEGORIA------------
*/

app.get('/categoria', categoria.getList);
app.get('/categoria/:id', categoria.getArticlesById);

/*
	-----------ARTICLE------------
*/

app.get('/article', articulo.getList);
app.get('/article/:id', articulo.getArticle);
app.post('/article', articulo.insertArticle);


/*
 ------------WEB PAGE------------
*/
app.get('/',function(req,res){
  res.sendFile("views/index.html",{root:application_root});
});
app.get('/login',function(req,res){
  res.sendFile("views/login.html",{root:application_root});
});
app.get('/signup',function(req,res){
  res.sendFile("views/signup.html",{root:application_root});
});
app.get('/hola',function(req,res){
  res.send("Hola Mundo");
});
app.get('/addArticle',function(req,res){
  res.sendFile("views/formAddArticle.html",{root:application_root});
});



//----------------------------------------------------------------
app.listen(8080, function () {
  console.log('Servidor arrancado en el puerto 8080!');
});

