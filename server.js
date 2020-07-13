//require( 'dotenv' ).config();
//require( './server/db-conn' );

const path = require( "path" );
const express = require( "express" );
const mongoose = require("mongoose");
const bodyParser = require( "body-parser" );
const passport = require( "passport" );

const users = require( "./routes/api/users" );

const app = express();

// bodyParser Middleware
app.use(
	bodyParser.urlencoded({
		extended: false
	})
);
app.use( bodyParser.json() );

// NEW db config
const db = require( "./config/keys" ).mongoURI;

// NEW connect to MongoDB
mongoose
	.connect(
		db,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.then( () => console.log( "MongoDB successfully connected" ) )
	.catch( err => console.log(err) );



app.use('/draftapi/', require('./routes/api/draftapi.js'));

// React
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});







// passport Middleware
app.use( passport.initialize() );

// passport configuration
require( "./config/passport" )( passport );

// Routes
app.use( "/routes/api/users", users );

const port = process.env.PORT || 8001;
app.listen( port, () => console.log( `Server up and running on port ${port} !` ) );