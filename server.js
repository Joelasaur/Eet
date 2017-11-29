//This part is the same as usual...
var express = require("express");
var app = express();

var http = require("http");

//We are getting an instance of a Node HTTP (web) server here.
//We are also telling it to connect up with our Express application,
//so it can handle requests.
var server = http.Server(app);

//On command prompt, we need to do "npm install socket.io"
var socketio = require("socket.io");

//instantiates our 'io' instance, and also connects it up with the HTTP
//server we already created.
var io = socketio(server);

//Just for static files (like usual).  Eg. index.html, client.js, etc.
app.use(express.static("pub"));
var UUID 			= require('node-uuid');
var gameport		= process.env.PORT || 4004;

var
	Eet 			= require("./src/Eet.js"),
	Player 			= require("./src/Player.js"),
	GameBoard 		= require("./src/GameBoard.js");

//Every time a client connects (visits the page) this function(socket) {...} gets executed.
//The socket is a different object each time a new client connects.
io.on("connection", function(socket) {
	console.log("Somebody connected.");
	//Generate a new UUID, looks something like 
	//5b2ca132-64bd-4513-99da-90e838ca47d1
	//and store this on their socket/connection
	socket.userid = UUID();

	//tell the player they connected, giving them their id
	socket.emit('onconnected', { id: socket.userid } );

	//Useful to know when someone connects
	console.log('\t socket.io:: player ' + socket.userid + ' connected');

	//When this client disconnects
	socket.on('disconnect', function () {
		console.log('\t socket.io:: client disconnected ' + socket.userid );
	});

	var player1 = new Player("Joel", socket.userid);

	console.log("Your name is " + player1.name + ", and your id is " + player1.id);
});

server.listen(gameport, function() {
	console.log("Server is listening on port " + gameport);
});



