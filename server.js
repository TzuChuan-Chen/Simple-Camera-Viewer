const app = require('express')(), 
		server = require('http').Server(app), 
		io = require('socket.io')(server), 
		rtsp = require('../lib/rtsp-ffmpeg');
		
// use rtsp = require('rtsp-ffmpeg') instead if you have install the package
server.listen(5000, function(){
	console.log('Listening on localhost:8000');
});

const fps = 60;
const resolution = '640x480';

var cams = [
		'rtsp://nckusport:Ncku1234@10.30.3.1:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.2:554/stream0', 
		'rtsp://nckusport:Ncku1234@10.30.3.3:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.4:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.5:554/stream0', 
		'rtsp://nckusport:Ncku1234@10.30.3.6:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.7:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.8:554/stream0', 
		'rtsp://nckusport:Ncku1234@10.30.3.9:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.10:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.11:554/stream0', 
		'rtsp://nckusport:Ncku1234@10.30.3.12:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.13:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.14:554/stream0', 
		'rtsp://nckusport:Ncku1234@10.30.3.15:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.16:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.17:554/stream0', 
		'rtsp://nckusport:Ncku1234@10.30.3.18:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.19:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.20:554/stream0', 
		'rtsp://nckusport:Ncku1234@10.30.3.21:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.22:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.23:554/stream0', 
		'rtsp://nckusport:Ncku1234@10.30.3.24:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.25:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.26:554/stream0', 
		'rtsp://nckusport:Ncku1234@10.30.3.27:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.28:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.29:554/stream0',
		'rtsp://nckusport:Ncku1234@10.30.3.30:554/stream0',
	].map(function(uri, i) {

		var stream = new rtsp.FFMpeg({input: uri, rate: fps, resolution: resolution, quality: 2});
		stream.on('start', function() {
			console.log('stream ' + i + ' started');
		});
		stream.on('stop', function() {
			console.log('stream ' + i + ' stopped');
		});
		return stream;
	});

cams.forEach(function(camStream, i) {
	var ns = io.of('/cam' + i);
	ns.on('connection', function(wsocket) {
		console.log('connected to /cam' + i);
		var pipeStream = function(data) {
			wsocket.emit('data', data);
		};
		camStream.on('data', pipeStream);
		
		wsocket.on('disconnect', function() {
			console.log('disconnected from /cam' + i);
			camStream.removeListener('data', pipeStream);
		});
	});
});

io.on('connection', function(socket) {
	socket.emit('start', cams.length);
});


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});
