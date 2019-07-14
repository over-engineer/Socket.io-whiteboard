const express = require('express');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const socketEvents = require('./socket-events');

// Serve the static files
app.use('/css', express.static(`${__dirname}/client/css`));
app.use('/js', express.static(`${__dirname}/client/js`));
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/client/index.html`);
});

// Socket.io connection handler
io.on('connection', (socket) => {
    // At this point a client has connected
    console.log(`A client has connected (id: ${socket.id})`);

    socket.on(socketEvents.DRAW, (data) => {
        socket.broadcast.emit(socketEvents.DRAW, data);
    });

    socket.on(socketEvents.DRAW_BEGIN_PATH, () => {
        socket.broadcast.emit(socketEvents.DRAW_BEGIN_PATH);
    });
});

// Start the server
const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
