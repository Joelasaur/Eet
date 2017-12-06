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

var UUID 			= require('node-uuid');
var gameport		= process.env.PORT || 4004;
var mongoClient 	= require("mongodb").MongoClient;
var ObjectId 		= require("mongodb").ObjectId;
var bodyParser 		= require("body-parser");
var Eet 			= require("./src/Eet.js");
var Player 			= require("./src/Player.js");

var shop = {};
var game = {};
var url = 'mongodb://localhost:27017/Eet';

var state = "main";
var storedInput = [];

app.use(express.static("pub"));
app.use(bodyParser.urlencoded({extended: false})); //we can use req.body

mongoClient.connect(url, function(err, database) {
	if(err) {
		console.log("There was a problem connecting to the database.");
		throw err;
	}
	else {
		console.log("Connected to Mongo and now creating server.");
		shop = database;
		shop.createCollection("players", function(err,res){
			if(err) throw err;
			console.log("Collection created!");
		});
		game = new Eet(shop);
	}
});



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

	socket.on('enter', function (playerInfo) {
		console.log("Info sent from client: " + playerInfo);

		var plyr = new Player(playerInfo.name, socket.userid, playerInfo.color, null);
		game.addPlayerToDB(plyr);
		game.joinGame(plyr);

		socket.emit("enterGameCredents", socket.userid);
		state = "game";

		console.log(plyr.name + " has successfully joined the game and chose this color: " + playerInfo.color);
	});

	socket.on('input', function(data) {
		//Here we need to store the input for processing, game.board.move will be moved to main game loop eventually
		storedInput.push({id: data.id, inputToProcess: {moves: data.inputs, dt: data.dt}});
		game.board.move(data.inputs, data.dt, data.id);
	});

	socket.on('collision', function(data) {
		var playerList = game.getPlayers();
		//console.log(data.id1);
		//console.log(data.id2);
		if(playerList[data.id1] && playerList[data.id2]) {
			if(playerList[data.id1].size > playerList[data.id2].size) {
				game.board.growPlayer(data.id1, playerList[data.id2].size);
				game.board.killPlayer(data.id2);
			}
			if(playerList[data.id1].size < playerList[data.id2].size) {
				game.board.growPlayer(data.id2, playerList[data.id1].size);
				game.board.killPlayer(data.id1);
			}
		}
	});

	//Serverside Main Update Loop
	setInterval(function(){
		if(state == "game") {
			game.board.doFoodGeneration();
			playerList = game.getPlayers();

			socket.emit("update", playerList);
		}
	}, 1000 / 30);

});

server.listen(gameport, function() {
	console.log("Server is listening on port " + gameport);
});
