/** The collectives parts were written by Bo **/

// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');

require('dotenv').config();

var authenticationController = require('./controllers/auth');
var collectiveController = require('./endPoints/items/controllers/collective');
var accountInfoAdditionalController = require('./endPoints/accountinfoadditional/controllers/accountinfoadditional');
var layerController = require('./endPoints/items/controllers/layer');
var hotpointController = require('./endPoints/items/controllers/hotpoint');
var userLevelController = require('./controllers/userLevel');

var Account =require('./endPoints/user/models/account');

// Connect to the MongoDB
mongoose.connect(process.env.DATABASE);

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.json({
    type: 'application/json',
    extended: true
}));

app.use(bodyParser.text({
    type: 'text/*'
}));

// Enables CORS
var enableCORS = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Length,X-Requested-With,APIKey');

    // intercept OPTIONS method
    if ('OPTIONS' === req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
// enable CORS!
app.use(enableCORS);

// Use the passport package in our application
app.use(passport.initialize());

app.all('/*', function (req, res, next) {
    console.log('Request:' + req.method + ' ' + req.url);

    if (req.body.APIKey !== process.env.APIKEY
        && req.headers.apikey !== process.env.APIKEY) {
        res.json({returnCode: false, responseText: 'Please Try Again.'}).end();
    } else {
        next();
    }
});

// Create our Express router
var router = express.Router();

// accountinfoadditional
router.route('/accountinfoadditional')
    .post(userLevelController.setRequiredUserLevel(4, false), 
            authenticationController.isAuthenticated, 
            //@inputs: req.body.accountId, (optional) req.body.description 
            //@output req.aAccountInfoAdditional
            accountInfoAdditionalController.getOrCreateAccountInfoAdditional, 
            accountInfoAdditionalController.returnResult //@input req.aAccountInfoAdditional
            )
    .get(userLevelController.setRequiredUserLevel(4, false), 
        authenticationController.isAuthenticated, 
        accountInfoAdditionalController.getAll);

router.route('/accountinfoadditional/:id')
    .get(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated,
    accountInfoAdditionalController.getById)
    .put(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated,
    accountInfoAdditionalController.update)
    .delete(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated,
		accountInfoAdditionalController.remove);
router.route('/accountinfoadditional/account/:accountId')
	.get(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated,
		accountInfoAdditionalController.getByAccountId);
// collectives
router.route('/collectives')
    .post(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, collectiveController.create)
    .get(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, collectiveController.getAll);
	
router.route('/collective/:id')
    .get(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, collectiveController.getById)
    .put(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, collectiveController.update)
    .delete(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, collectiveController.remove);

// Layers
router.route('/layers')
    .post(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, layerController.create);

router.route('/layers/:collectiveId')
    .get(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, layerController.getAll);
	
router.route('/layer/:id')
    .get(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, layerController.getById)
    .put(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, layerController.update)
    .delete(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, layerController.remove);

// /entries
router.route('/hotpoints')
    .post(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, hotpointController.create);

router.route('/hotpoints/:layerId')
    .get(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, hotpointController.getAll);

router.route('/hotpoint/:id')
    .get(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, hotpointController.getById)
    .put(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, hotpointController.update)
    .delete(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, hotpointController.remove);

router.route('/clearCollectiveFiles/:id')
    //.get(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, collectiveController.getById)
    //.put(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, collectiveController.updateFileName)
    .delete(userLevelController.setRequiredUserLevel(4, false), authenticationController.isAuthenticated, collectiveController.removeCollectiveFiles);

// Register all our routes with /api
app.use(process.env.APIPATH, router);
app.disable('x-powered-by');

// Start the server
// Use PORT defined in .env
var port = process.env.PORT;
app.listen(port);
console.log('Museum Items MicroServer Listening on port ' + port);
