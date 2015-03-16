var connected = false;
var timeout;
const RETRY_INTERVAL = 5000;

var socket = new io.Socket();

socket.on('connect', function() {
  socket.subscribe(token);
});

socket.on('disconnect', function() {
 connected = false;
  console.log('SocketIo disconnected, trying to automatically reconnect in ' + RETRY_INTERVAL/1000 + ' seconds.');
  retryConnectOnFailure(RETRY_INTERVAL);
});

var retryConnectOnFailure = function(retryInMilliseconds) {
  if(!connected) {
    timeout = setTimeout(function() {
      socket.connect();
      retryConnectOnFailure(retryInMilliseconds);
    }, retryInMilliseconds);
  }
}

socket.connect();
retryConnectOnFailure(RETRY_INTERVAL);