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

var offsetX = 0;
var offsetY = 0;
var scale = 1;

var playerList = {};

var move = function(direction, dt, UUID) {
	if(this.playerList[UUID]) {
		//console.log(direction + " :: " + UUID);
		//console.log(this.playerList[UUID].x);
		if (direction.right) {
			this.playerList[UUID].x += dt * .2;
		}
		if (direction.left) {
			this.playerList[UUID].x -= dt * .2;
		}
		if (direction.up) {
			this.playerList[UUID].y -= dt * .2;
		}
		if (direction.down) {
			this.playerList[UUID].y += dt * .2;
		}
	}
}

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

			move(input, dt, myID);


			socket.emit("input", {id: myID, dt: dt, inputs: input, canvasW: canvas.width, canvasH: canvas.height});

			context.save();
			//console.log("OFFSETX - " + offsetX + " OFFSETY - " + offsetY);
			context.translate(offsetX, offsetY);

			context.clearRect(-offsetX, -offsetY, canvas.width, canvas.height);

			//Drawing our list of players
			for (var item in playerList) {

				// -- HIT DETECTION
				for (var hitmebaby in playerList) {
					if(playerList[item].id != playerList[hitmebaby].id) {

						var p1x = Math.max(playerList[item].x, playerList[hitmebaby].x);
						var p1y = Math.max(playerList[item].y, playerList[hitmebaby].y);

						var p2x = Math.min(playerList[item].x+playerList[item].size, playerList[hitmebaby].x+playerList[hitmebaby].size);
						var p2y = Math.min(playerList[item].y+playerList[item].size, playerList[hitmebaby].y+playerList[hitmebaby].size);

						if(p2x-p1x > 0 && p2y-p1y > 0) {
							console.log("WE COLLIDIN");
							socket.emit('collision', {id1: playerList[item].id, id2: playerList[hitmebaby].id});
						}
					}
				}


				// -- DRAWING
				context.beginPath();

				//If the item in the list is our player, draw and set context/scale (game-window)
				if(item == myID) {
					//console.log("X : " + playerList[item].x);
					//console.log("Y : " + playerList[item].y);
					//console.log("Scale : " + (20/ playerList[item].size));
						//CAMERA MOVEMENT SOMEDAY
					//offsetX = ((playerList[item].x) - (canvas.width/2));
					//offsetY = ((playerList[item].y) - (canvas.height/2));
					//scale = (10/playerList[item].size);
					//context.arc(playerList[item].x - offsetX, playerList[item].y - offsetY, playerList[item].size, 0, 2 * Math.PI, false);

		      context.arc(playerList[item].x, playerList[item].y, playerList[item].size, 0, 2 * Math.PI, false);
		      context.fillStyle = playerList[item].col;

		      context.lineWidth = playerList[item].size / 32;
		      context.strokeStyle = '#fff';

					context.font = "12px Arial";
					context.fillText(playerList[item].name, playerList[item].x - 20 - playerList[item].size, playerList[item].y - 20 - playerList[item].size);

				} else { //Else just draw it

		      context.arc(playerList[item].x, playerList[item].y, playerList[item].size, 0, 2 * Math.PI, false);
		      context.fillStyle = playerList[item].col;

		      context.lineWidth = playerList[item].size / 32;
		      context.strokeStyle = '#fff';

					context.font = "12px Arial";
					context.fillText(playerList[item].name, playerList[item].x - playerList[item].size, playerList[item].y - 20 - playerList[item].size);
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
