var socket = io();

$(function() {
	socket.on('onconnected', function( data ) {
		//Note that the data is the object we sent from the server, as is. So we can assume its id exists. 
		console.log( 'Connected successfully to the socket.io server. My server side ID is ' + data.id );
	});
});