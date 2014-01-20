
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var argv = require('optimist')
			.usage('Usage: $0 [config file]')
			.argv;
if (argv._[0]) {
	var config = require(argv._[0]);
} else {
	console.log("no config specified");
}


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket) {
	socket.on('state', function(data) {
		socket.broadcast.emit('state', data);
	});

	socket.on('event', function(data) {
		console.log("broadcasting event", data);
		socket.broadcast.emit('event', data);
	});

	socket.on('action', function(data) {
		console.log("broadcasting action",data);
		socket.broadcast.emit('action', data);
	});

	socket.on('update', function(data) {
		socket.broadcast.emit('update', data);
	});
});

