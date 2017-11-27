// app code has been adapted from a template we found here:
// http://buildnewgames.com/real-time-multiplayer/
var 
	Eet 			= require("./src/Eet.js"),
	Player 			= require("./src/Player.js"),
	GameBoard 		= require("./src/GameBoard.js"),

	gameport		= process.env.PORT || 4004,

	socketio		= require('socket.io'),
	http 			= require("http"),
	express			= require('express'),
	UUID 			= require('node-uuid'),
	bodyParser 		= require("body-parser"),

	verbose			= false,
	app 			= express(),
	server 			= http.Server(app);
	io 				= socketio(server);
	

app.use(express.static("pub")); //static files served up (like index.html)
app.use(bodyParser.urlencoded({extended: true})); //we can use req.body

//This handler will listen for requests on /*, any file from the root of our app.
//See expressjs documentation for more info on routing.
app.get( '/*' , function( req, res, next ) {

	//This is the current file they have requested
	var file = req.params[0]; 

	//For debugging, we can track what files are requested.
	if(verbose) console.log('\t :: Express :: file requested : ' + file);

	//Send the requesting client the file.
	res.sendFile( __dirname + '/' + file );

}); //app.get *

//Socket IO
io.on('connection', function (client) {

	//Generate a new UUID, looks something like 
	//5b2ca132-64bd-4513-99da-90e838ca47d1
	//and store this on their socket/connection
	client.userid = UUID();

	//tell the player they connected, giving them their id
	client.emit('onconnected', { id: client.userid } );

	//Useful to know when someone connects
	console.log('\t socket.io:: player ' + client.userid + ' connected');

	//When this client disconnects
	client.on('disconnect', function () {
		console.log('\t socket.io:: client disconnected ' + client.userid );
	});

});

app.listen( gameport );
//Log something so we know that it succeeded.
console.log('\t :: Express :: Listening on port ' + gameport );