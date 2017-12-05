var socket = io();
var DEFAULT_COLOR = "#f00";

var canvas = null;
var context = null;

var camX = 0;
var camY = 0;

var myID = "";

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

		canvas = document.getElementById('gameCanvas');
		context = canvas.getContext('2d');

		context.canvas.height = window.innerHeight - 30;
		context.canvas.width = window.innerWidth - 30;

		camX = 0;
		camY = 0;
	});

	socket.on("enterGameCredents", function( playerID ) {
		myID = playerID;
	});

	socket.on('update', function( data ) {
		for (var item in data) {
			if(item == myID) {
				context.beginPath();
	      context.arc(data[item].x, data[item].y, data[item].size, 0, 2 * Math.PI, false);
	      context.fillStyle = playerColor;
	      context.fill();
	      context.lineWidth = 1;
	      context.strokeStyle = '#003300';
	      context.stroke();
				context.closePath();

				context.translate(data[item].x + (canvas.width/2), data[item].y + (canvas.height/2));
				context.scale(20 / data[item].size, 20 / data[item].size);
			} else {
				context.beginPath();
	      context.arc(data[item].x, data[item].y, data[item].size, 0, 2 * Math.PI, false);
	      context.fillStyle = DEFAULT_COLOR;
	      context.fill();
	      context.lineWidth = 3;
	      context.strokeStyle = '#003300';
	      context.stroke();
				context.closePath();
			}
		}
	});
}

$(start);
