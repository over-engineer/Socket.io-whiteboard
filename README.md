# Socket.io whiteboard

[![GitHub](https://img.shields.io/github/license/over-engineer/Socket.io-whiteboard.svg)](/LICENSE)
[![GitHub last commit](https://img.shields.io/github/last-commit/over-engineer/Socket.io-whiteboard.svg)](/)
[![Demo](https://img.shields.io/static/v1.svg?label=Demo&message=Heroku&color=blueviolet)](http://socketio-whiteboard.herokuapp.com/)

🎨 HTML5 canvas real-time drawing using socket.io

## Table of Contents

* [What is this?](#-what-is-this)
* [Installation](#-installation)
* [Demo](#-demo)
* [Documentation](#-documentation)
* [Dependencies](#-dependencies)
* [License](#-license)


## 🖌 What is this?

This is a simplified version of the JavaScript code I use for a sketch guessing multiplayer game I'm working on. Keep in mind that it's still under development as I'm experimenting with different ways to build this. Still, this could be a nice start for similar projects.

## 📦 Installation

1. Include Socket.io in your client-side code

    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"
            integrity="sha256-yr4fRk/GU1ehYJPAs8P4JlTgu0Hdsp4ZKrx8bDEDC3I="
            crossorigin="anonymous"></script>
    ```
    
2. Include this library in your client-side code

    ```html
    <script src="https://cdn.jsdelivr.net/gh/over-engineer/Socket.io-whiteboard/lib/whiteboard.js" 
            integrity="sha384-FlDHLCQSFbcUq5CJcPJXlkXgnc27L9WQgcNExYOd6jdb9zfM/jA1xQ5MyCpOqsma" 
            crossorigin="anonymous"></script>
    ```

3. Create a Whiteboard instance using `new Whiteboard()`, passing your canvas, your socket and optionally a default color and thickness.

    For example:

    ```javascript
    const canvas = document.querySelector('canvas');
    const whiteboard = new Whiteboard(canvas, socket);
    ```
    
4. For the server-side, check the `/demo/backend` directory

## 🎉 Demo

Check out the [demo](http://socketio-whiteboard.herokuapp.com/) (open the console!)

…or do it yourself:

1. Make sure you have [Node.js](https://nodejs.org/) installed.

2. Clone this repository

    ```
    $ git clone git@github.com:over-engineer/Socket.io-whiteboard.git
    $ cd ./Socket.io-whiteboard
    ```

3. Install the dependencies

    ```
    $ npm install
    ```
    
4. Start the server

    ```
    $ npm start
    ```

5. Go to [localhost:3000](http://localhost:3000/)

## 📚 Documentation

The [demo](http://socketio-whiteboard.herokuapp.com/) has the bare minimum functionality to keep it as simple as possible.

In a real-world scenario you would have to customize the color, the thickness of the line, download drawings etc

These are the public methods you'll find in the `/lib/whiteboard.js` file:

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

## 🗄 Dependencies

- [socket.io](http://socket.io/)
- [Node.js](https://nodejs.org/)
- [Express](http://expressjs.com/)

## 📖 License

The MIT License, check the `LICENSE` file.
