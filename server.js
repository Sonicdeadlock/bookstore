/**
 * Created by alexthomas on 4/5/16.
 */
var config = require('./config');
var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var session = require('express-session');
var server = require('http').createServer(app);
//Web Routes
var web = require('./routes/index');
var api = require('./routes/api');


//Configure Express
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: config.session.secret,
    cookie: config.session.cookie,
    resave: false,
    saveUninitialized: false,
    unset: "destroy"
}));

//Register routes
app.use('/', web);
app.use('/api', api);


//On Error
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("There was an error processing your request");
});


//Start app
server.listen(config.web.port);


//Debug
console.log('serving from:', __dirname);
console.log('listening on:', config.web.port);

module.exports = app;