var whiteboard = new function() {
	var THICKNESS_MIN = 1;
	var THICKNESS_MAX = 120;
	
	var canvas = null;
	var ctx = null;
	
	// use `whiteboard.setColor` and `whiteboard.setThickness`
	// to change the values of the color and thickness variables
	var color = "#4d4d4d"; 		// default color
	var thickness = 4; 		// default thickness

	/**
	 * Enum for drawing socket events
	 * 
	 * @readonly
	 * @enum {string}
	 */
	var SocketEnum = {
		DRAW: "draw",
		DRAWBEGINPATH: "draw begin path"
	};

	/**
	 * Initialize the whiteboard-related stuff
	 * 
	 * @param canvasObj 	The canvas jQuery object
	 * @param socket 	The socket.io socket, so
	 * 			we can send/receive data
	 * 			related to the drawing
	 */
	this.init = function(canvasObj, socket) {
		canvas = canvasObj.get(0);
		
		ctx = canvas.getContext("2d");
		
		// canvas mouse events
		canvasObj.mousedown(function(e) {
			ctx.beginPath();
			socket.emit(SocketEnum.DRAWBEGINPATH);
		});
		canvasObj.mousemove(function(e) {
			// check if we're holding the left click down while moving the mouse
			if (e.buttons == 1) {
				draw(e, socket);
			}
		});
		
		// window resize handling
		resizeCanvas();
		$(window).resize(function() {
			resizeCanvas();
		});
		
		// socket handlers
		socket.on(SocketEnum.DRAW, socketDraw);
		socket.on(SocketEnum.DRAWBEGINPATH, function() { ctx.beginPath(); });
	}

	/**
	 * Resize the canvas, so its width and height
	 * attributes are the same as the offsetWidth
	 * and offsetHeight
	 * 
	 * The .width and .height defaults to 300px and
	 * 150px and we have to change them to match the
	 * .offsetWidth and .offsetHeight, which are the
	 * layout width and heights of our scaled canvas
	 * (the ones we have set in our CSS file)
	 */
	var resizeCanvas = function() {
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		
		// clear the canvas for the browsers that don't fully clear it
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	}

	/**
	 * Get the mouse input and draw on our canvas
	 * 
	 * @param e 		The jQuery event parameter, we
	 * 			use it to get the layerX. Since
	 * 			this is from a jQuery event, we
	 * 			need to use the .originalEvent first
	 * @param socket 	The socket.io socket so we can
	 * 			emit the drawing data
	 */
	var draw = function(e, socket) {
		// It seems that layerX is non-standard. We should use something else.
		// See more: https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/layerX
		var cX = e.originalEvent.layerX - canvas.offsetLeft;
		var cY = e.originalEvent.layerY - canvas.offsetTop;
		
		ctx.strokeStyle = color;
		ctx.lineWidth = thickness;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.lineTo(cX, cY);
		ctx.stroke();
		
		socket.emit(SocketEnum.DRAW, {
			x: cX,
			y: cY,
			color: color,
			thickness: thickness
		});
	}

	/**
	 * Get the drawing data from the socket and basically
	 * draw on our canvas whatever the other person draws
	 * 
	 * @param data 	The drawing data
	 */
	var socketDraw = function(data) {
		ctx.strokeStyle = data.color;
		ctx.lineWidth = data.thickness;
		ctx.lineTo(data.x, data.y);
		ctx.lineJoin = "round";
		ctx.lineCap = "round";
		ctx.stroke();
	}

	/** 
	 * Increase the thickness
	 * 
	 * @param step 	The amount of the increase (e.g. 
	 * 		`whiteboard.increaseThickness(1)` 
	 * 		will increase the thickness by 
	 * 		1 pixel)
	 */
	this.increaseThickness = function(step) {
		thickness += step;
		
		if (thickness > THICKNESS_MAX) {
			thickness = THICKNESS_MAX;
		}
	}


	/** 
	 * Decrease the thickness
	 * 
	 * @param step 	The amount of the decrease (e.g. 
	 * 		`whiteboard.decreaseThickness(1)` 
	 * 		will decrease the thickness by 
	 * 		1 pixel)
	 */
	this.decreaseThickness = function(step) {
		thickness -= step;
		
		if (thickness < THICKNESS_MIN) {
			thickness = THICKNESS_MIN;
		}
	}

	/**
	 * Save our canvas drawing as an image file.
	 * Using this method allows us to have a custom
	 * name for the file we will download
	 * 
	 * @param filename 	The name of the image file
	 * 
	 * Source: http://stackoverflow.com/a/18480879
	 */
	this.download = function(filename) {
		var lnk = document.createElement("a");
		var e;
		
		lnk.download = filename;
		lnk.href = canvas.toDataURL();
		
		if (document.createEvent) {
			e = document.createEvent("MouseEvents");
			e.initMouseEvent("click", true, true, window,
					0, 0, 0, 0, 0, false, false, false,
					false, 0, null);
			
			lnk.dispatchEvent(e);
		} else if (lnk.fireEvent) {
			lnk.fireEvent("onclick");
		}
	}

	// Setters
	this.setColor = function(val) { color = val; }
	this.setThickness = function(val) { thickness = val; }

	// Getters
	this.getColor = function() { return color; }
	this.getThickness = function() { return thickness; }
};
