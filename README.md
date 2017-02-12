# Socket.io whiteboard
HTML5 canvas real-time drawing using socket.io

### What is this?
This is a simplified version of the JavaScript code I use for a sketch guessing multiplayer game I'm working on. Keep in mind that it's still under development as I'm experimenting with different ways to build this. Still, this could be a nice start for similar projects.

I'd recommend you to familiarize youself with socket.io before diving into my project. Its [documentation](http://socket.io/docs/) is really straightforward and newbie-friendly in my opinion.

### Requirements
You need to install the following in order to run this project:
- [socket.io](http://socket.io/)
- [Node.js](https://nodejs.org/)
- [Express](http://expressjs.com/)
- [jQuery](https://jquery.com/)

### Setting it up
1. Make sure you have [Node.js](https://nodejs.org/) installed.

2. Install the Express framework, by running this command:
`npm install --save express@4.10.2`

3. Install the socket.io server:
`npm install socket.io`

4. Include **socket.io** and **jQuery** in your HTML file. Here's how to do it using their CDNs:
    ```javascript
    <script src="https://code.jquery.com/jquery-1.11.2.min.js" integrity="sha256-Ls0pXSlb7AYs7evhd+VLnWsZ/AqEHcXBeMZUycz/CcA=" crossorigin="anonymous"></script>
    <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
    ```
Obviously, the code above will load jQuery v1.11.2 and socket.io v1.4.5. You have to visit their official websites ([jQuery](https://code.jquery.com/), [socket.io](http://socket.io/download/)) to get the latest versions.

5. Include this project's **whiteboard.js** in your client's html file
    ```javascript
    <script src="whiteboard.js"></script>
    ```

6. You have to create a Whiteboard instance using `new Whiteboard`, passing your canvas jQuery object, your socket and optionally a default color and thickness. For example:
    ```javascript
    var whiteboard = new Whiteboard($("#myCanvas"), socket);
    ```

7. Add the following code to your server's js file:
    ```javascript
    socket.on("draw", function(data) {
      socket.broadcast.emit("draw", data);
    });
    socket.on("draw begin path", function() {
      socket.broadcast.emit("draw begin path");
    });
    ```

For the complete code of these files, check the *demo* folder.

### Usage example
Below you can find a basic example with simple server.js and index.html files.

**server.js (the server side):**
```javascript
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
```

**index.html (the client side):**
```html
<!DOCTYPE HTML>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Demo - Client side</title>
  </head>
  <body>
    <!-- Note that the id of our canvas is #myCanvas -->
    <canvas id="myCanvas"></canvas>

    <!-- Import jQuery, socket.io and our whiteboard.js -->
    <script src="https://code.jquery.com/jquery-1.11.2.min.js" integrity="sha256-Ls0pXSlb7AYs7evhd+VLnWsZ/AqEHcXBeMZUycz/CcA=" crossorigin="anonymous"></script>
    <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
    <script src="js/whiteboard.js"></script>

    <!-- Our JavaScript code, normally this would be in a .js file -->
    <script type="text/javascript">
      var socket = io();
      socket.on("connect", function() {
        /* at this point we have connected to the server,
        so we can create a new Whiteboard instance.
        We pass our canvas (`#myCanvas`) and socket */
        var whiteboard = new Whiteboard($("#myCanvas"), socket);
      });
    </script>
  </body>
</html>
```

If you just want to test this example locally on your computer, run `node server.js` to start the server and open `http://localhost:3000` on your browser.

### Usage
The example above has the bare minimum functionality to keep it as simple as possible. In a real-world scenario you would have to change the color, the thickness of the line etc.

These are the public methods you'll find in the `whiteboard.js` file:

| Method                                | Explanation                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `whiteboard.color = newValue`         | Sets the line color to the given value                                        |
| `whiteboard.color`                    | Returns the current color of the line                                         |
| `whiteboard.thickness = newValue`     | Sets the line thickness to the given value                                    |
| `whiteboard.thickness`                | Returns the current thickness of the line                                     |
| `whiteboard.increaseThickness(step)`  | Increases the thickness of the line by the given step                         |
| `whiteboard.decreaseThickness(step)`  | Decreases the thickness of the line by the given step                         |
| `whiteboard.download(filename)`       | Exports the canvas drawing as an image file and saves it with the given name  |

In the above table `whiteboard` in an instance of `Whiteboard`

### License
The MIT License, check the `LICENSE` file.
