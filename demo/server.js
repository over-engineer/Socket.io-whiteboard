var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);

app.use("/js", express.static(__dirname + "/js"));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
	// at this point a client has connected
	socket.on("draw", function(data) {
		socket.broadcast.emit("draw", data);
	});
	
	socket.on("draw begin path", function() {
		socket.broadcast.emit("draw begin path");
	});
});

http.listen(3000, function() {
	console.log("Listening on port 3000");
});
