var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require('mongojs');
// const { check, validationResult } = require('express-validator/check');

var app = express();

// Initialize database 
var db = mongojs('hearafrica',['users','sites']);

/** MIDDLEWARE */
// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/* HELPERS */
function responserBuilder(code,message, body){
    return { code:code,message:message,body:body };
}

/* ROUTES */
// Index
app.get('/', function(req, res){
    res.send("Welcome to HearAfrica");
});

//Create user
app.post('/api/users/signup', function(req, res){
    // check('first_name').notEmpty();
    // check('email').isEmail();
    // check('password').notEmpty();
    var newUser={
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        country: req.body.country,
        signed_in : false,
        active : true

    };
    db.users.insert(newUser, function(err, results){
        if(err){
            res.json( responserBuilder(201, err, {}) );
        }else{
            res.json( responserBuilder(200, 'User created successfully', results) );
        }
    });
});

// List all users
app.get('/api/users', function(req, res){
    db.users.find(function(err, results){
        if(err){
            res.json( responserBuilder(201, 'Failed', results) );
        }else{
            res.json( responserBuilder(200, 'Successful', results) );
        }
    });
});

// Log in
app.post('/api/users/authenticate', function(req,res){
    //Authenticate and set signedin to true
    db.users.findAndModify({
        query: {email:req.body.email, password:req.body.password},
        update: { $set: { signed_in: true } },
        new: true
    }, function(err,results){
        if(err){
            res.json( responserBuilder(501, 'Internar Server Error', err) );
        }
        if(results.length==0){
            res.json( responserBuilder(201, 'Invalid username or password', results) );
        }else{
            res.json( responserBuilder(200, 'Authenticated', results) );
        }
    });
});

// Logout
app.get('/api/users/logout/:user_id', function(req,res){
    db.users.findAndModify({
        query: {_id: req.params.user_id},
        update: { $set: { signed_in: false } },
        new: true
    }, function(err,results){
        if(err){
            res.json( responserBuilder(501, 'Internar Server Error', err) );
        }
        res.json( responserBuilder(200, 'User logged out successfully', {}) );
    });
});

// Create a site
app.post('/api/sites/create', function(req, res){
    var newSite = {
        site_name: req.body.site_name,
        description: req.body.description,
        audio_path: '/path/to/audio/file',
        image_path: '/path/to/image/file',
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        ratings: 0,
        views: 0
    };
    db.sites.insert(newSite, function(err,results){
        if(err){
            res.json( responserBuilder(501,'Internal Server Error' , err) );
        }else{
            res.json( responserBuilder(200, 'Site added successfully', results) );
        }
    });
});

// Get sites list
app.get('/api/sites', function(req, res){
    db.sites.find(function(err, results){
        if(err){
            res.json( responserBuilder(501,'Internal Server Error' , err) );
        }
        res.json( responserBuilder(200,'Success' , results) );
    });
});

// Get site by id
app.get('/api/sites/:site_id', function(req, res){
    db.sites.findOne({_id: mongojs.ObjectId(req.params.site_id)},function(err, results){
        if(err){
            res.json( responserBuilder(501,'Internal Server Error' , err) );
        }
        res.json( responserBuilder(200,'Success' , results) );
    });
});

/** Start server **/
var port = 4000 || process.env.PORT;
app.listen(port, function(){
    console.log("Server listening at "+port+"...");
});