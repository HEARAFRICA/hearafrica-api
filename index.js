var express = require('express');
var bodyParser = require('body-parser');

var app = express();

/** MIDDLEWARES */
// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/* ROUTES */
// Index
app.get('/', function(req, res){
    res.send("Welcome to HearAfrica")
})

// Start server
var port = 4000
app.listen(port, function(){
    console.log("Server listening at "+port+"...")
})