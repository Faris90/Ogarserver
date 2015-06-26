var express = require('express'), app = express(), server = require('http').createServer(app), io = require('socket.io').listen(server), conf = require('./config.json');
server.listen(conf.port);

var serverData = new Object();

io.sockets.on('connection', function(socket) {
	socket.emit("request", {});
	
	socket.on('server', function(data) {
		ip = socket.client.conn.remoteAddress.toString().split(":");
		tmp = new Object();
		tmp['ipAddr'] = ip[ip.length-1];
		tmp['serverPort'] = data.serverPort;
		tmp['infoPort'] = data.infoPort;
		serverData[socket.id] = tmp;
		
		console.log(serverData);
	});
	
	socket.on('retrieve', function() {
		console.log(serverData);
		socket.emit('serverlist', serverData);
	});
	
	socket.on('disconnect', function() {
		delete serverData[socket.id];
	});
});

console.log('Masterserver listening on ' + conf.port)
