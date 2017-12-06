var socket = io();
var DEFAULT_COLOR = "#f00";

var canvas = null;
var context = null;

var input = {
  up: false,
  down: false,
  left: false,
  right: false
}

var camX = 0;
var camY = 0;

var myID = "";

var state = "main";

var playerList = {};

$(function() {
	socket.on('onconnected', function( data ) {
		//Note that the data is the object we sent from the server, as is. So we can assume its id exists.
		console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
	});
});

function start() {
	var playerColor = DEFAULT_COLOR;
	$("#colorpicker").spectrum({
		color: DEFAULT_COLOR,
		move: function(tinycolor) { },
		show: function(tinycolor) { },
		hide: function(tinycolor) { },
		beforeShow: function(tinycolor) { },
		change: function(color) {
			playerColor = color.toHexString(); // #ff0000
			console.log("Your color: " + playerColor);
		}
	});

	$("#enterGame").click(function () {
		socket.emit("enter", {name: $("#playerName").val(), color: playerColor});

		$('div').hide();
		$('#game').show();

		state = "game";

		canvas = document.getElementById('gameCanvas');
		context = canvas.getContext('2d');

		context.canvas.height = window.innerHeight - 30;
		context.canvas.width = window.innerWidth - 30;

		camX = 0;
		camY = 0;
	});

	//Getting client input and storing them in an array to be sent to server
	document.addEventListener('keydown', function(event) {
	  switch (event.keyCode) {
	    case 65: // A
	      input.left = true;
	      break;
	    case 87: // W
	      input.up = true;
	      break;
	    case 68: // D
	      input.right = true;
	      break;
	    case 83: // S
	      input.down = true;
	      break;
	  }
	});

	document.addEventListener('keyup', function(event) {
	  switch (event.keyCode) {
	    case 65: // A
	      input.left = false;
	      break;
	    case 87: // W
	      input.up = false;
	      break;
	    case 68: // D
	      input.right = false;
	      break;
	    case 83: // S
	      input.down = false;
	      break;
	  }
	});

	socket.on("enterGameCredents", function( playerID ) {
		//Getting the players ID from server
		myID = playerID;
	});

	socket.on('update', function( data ) {
		//Getting Authoritative Playerlist from Server
		playerList = data;
	});

	var lastUpdateTime = (new Date()).getTime();
	setInterval(function() {
		//Only do game loop if actually in game
		if(state == "game") {

	  	var currentTime = (new Date()).getTime();
	  	var dt = currentTime - lastUpdateTime;

			socket.emit("input", {id: myID, dt: dt, inputs: input});

			context.save();
			context.clearRect(0, 0, canvas.width, canvas.height);

			//Drawing our list of players
			for (var item in playerList) {

				context.beginPath();

				//If the item in the list is our player, draw and set context/scale (game-window)
				if(item == myID) {
					console.log("X : " + playerList[item].x);
					console.log("Y : " + playerList[item].y);
					console.log("Scale : " + (20/ playerList[item].size));

		      context.arc(playerList[item].x, playerList[item].y, playerList[item].size, 0, 2 * Math.PI, false);
		      context.fillStyle = playerColor;

		      context.lineWidth = 3;
		      context.strokeStyle = '#003300';

					context.translate(playerList[item].x + (canvas.width/2), playerList[item].y + (canvas.height/2));
					context.scale(20 / playerList[item].size, 20 / playerList[item].size);
				} else { //Else just draw it

		      context.arc(playerList[item].x, playerList[item].y, playerList[item].size, 0, 2 * Math.PI, false);
		      context.fillStyle = DEFAULT_COLOR;

		      context.lineWidth = 3;
		      context.strokeStyle = '#003300';
				}

				context.fill();
				context.stroke();
				context.closePath();

			}

			context.restore();
			//dt calculations
	  	lastUpdateTime = currentTime;
		}
	}, 1000 / 30);

}

$(start);
