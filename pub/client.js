var socket = io();
var DEFAULT_COLOR = "#f00";

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
	});
}
$(start);