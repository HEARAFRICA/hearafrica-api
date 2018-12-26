var express = require('express');
var bodyParser = require('body-parser');

var app = express();

/** MIDDLEWARES */
// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/* HELPERS */
function responserBuilder(code,message, body){
    return { code:code,message:message,body:body }
}

/* ROUTES */
// Index
app.get('/', function(req, res){
    res.send("Welcome to HearAfrica")
})

//Create user
app.post('/api/users/signup', function(req, res){
    console.log(req.body)
    res.json( responserBuilder(200, 'User created successfully', {}) )
})

// List all users
app.get('/api/users', function(req, res){
    res.json( responserBuilder(200, 'Successful', {}) )
})

// Authenticate

// Start server
var port = 4000
app.listen(port, function(){
    console.log("Server listening at "+port+"...")
})