// Connect to the nodeJs Server
const socket = io('/', {
      secure: true,
      rejectUnauthorized: false,
      path: '/draw/socket.io'
});

// (1): Send a ping event with 
// some data to the server
console.log( "socket: browser says ping (1)" )
socket.emit('ping', { some: 'data' } );

// (4): When the browser recieves a pong event
// console log a message and the events data
socket.on('pong', function (data) {
	console.log( 'socket: server said pong (4)', data );
});
