var Whiteboard = (function($, window) {
	"use strict";

	const THICKNESS_MIN = 1;
	const THICKNESS_MAX = 120;

	var _canvas = null, _ctx = null;
	var _color = null, _thickness = null;

	var SocketEvents = {
		DRAW: "draw",
		DRAWBEGINPATH: "draw begin path"
	};

	/**
	 * Constructor
	 *
	 * @param {jQuery} $canvas              The canvas jQuery object
	 * @param {socket} socket               The socket.io socket, so we
	 *                                      can send/received drawing data
	 * @param {string} [color="#4d4d4d"]    The default color
	 * @param {number} [thickness=4]        The default thickness
	 * @constructor
	 */
	function Whiteboard($canvas, socket, color, thickness) {
		color = (typeof color !== "undefined") ? color : "#4d4d4d";
		thickness = (typeof thickness !== "undefined") ? thickness : 4;

		if (!(this instanceof Whiteboard)) {
			throw new TypeError("Cannot call a class as a function");
		}

		_canvas = $canvas[0];
		_color = color;
		_thickness = thickness;

		$canvas.mousedown(function() {
			_ctx.beginPath();
			socket.emit(SocketEvents.DRAWBEGINPATH);
		});
		$canvas.mousemove(function(e) {
			// check if we're holding the left click down while moving the mouse
			if (e.buttons == 1) {
				draw(e.originalEvent, socket);
			}
		});

		resizeCanvas();
		$(window).resize(resizeCanvas);

		socket.on(SocketEvents.DRAW, socketDraw);
		socket.on(SocketEvents.DRAWBEGINPATH, function() {
			_ctx.beginPath();
		});
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
	function resizeCanvas() {
		_canvas.width = _canvas.offsetWidth;
		_canvas.height = _canvas.offsetHeight;

		// clear the canvas for the browsers that don't fully clear it
		_ctx.clearRect(0, 0, _ctx.canvas.width, _ctx.canvas.height);
	}

	/**
	 * Get the mouse input and draw on our canvas
	 *
	 * @param {Event} e         The original event of `.mousemove()`
	 * @param {socket} socket   The socket.io socket, so we can emit the drawing data
	 */
	function draw(e, socket) {
		// It seems that layerX is non-standard. We should use something else.
		// See more: https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/layerX
		var cX = e.layerX - _canvas.offsetLeft;
		var cY = e.layerY - _canvas.offsetTop;

		_ctx.strokeStyle = _color;
		_ctx.lineWidth = _thickness;
		_ctx.lineJoin = "round";
		_ctx.lineCap = "round";
		_ctx.lineTo(cX, cY);
		_ctx.stroke();

		socket.emit(SocketEvents.DRAW, {
			x: cX,
			y: cY,
			color: _color,
			thickness: _thickness
		});
	}

	/**
	 * Get the drawing data from the socket and basically
	 * draw on our canvas whatever the other person draws
	 *
	 * @param {Object} data     The drawing data
	 */
	function socketDraw(data) {
		_ctx.strokeStyle = data.color;
		_ctx.lineWidth = data.thickness;
		_ctx.lineTo(data.x, data.y);
		_ctx.lineJoin = "round";
		_ctx.lineCap = "round";
		_ctx.stroke();
	}

	/**
	 * Save our canvas drawing as an image file.
	 * Using this method allows us to have a custom
	 * name for the file we will download
	 *
	 * Source: http://stackoverflow.com/a/18480879
	 *
	 * @param {string} filename     The name of the image file
	 */
	Whiteboard.prototype.download = function(filename) {
		var lnk = document.createElement("a");
		var e;

		lnk.download = filename;
		lnk.href = _canvas.toDataURL();

		if (document.createEvent) {
			e = document.createEvent("MouseEvents");
			e.initMouseEvent("click", true, true, window,
				0, 0, 0, 0, 0, false, false, false,
				false, 0, null);

			lnk.dispatchEvent(e);
		} else if (lnk.fireEvent) {
			lnk.fireEvent("onclick");
		}
	};

	/**
	 * Increase the thickness
	 *
	 * @param {number} step     The amount of the increase
	 *                          (e.g. `.increaseThickness(1)`
	 *                          will increase the thickness by 1 pixel)
	 */
	Whiteboard.prototype.increaseThickness = function(step) {
		_thickness += step;

		if (_thickness > THICKNESS_MAX) {
			_thickness = THICKNESS_MAX;
		}
	};

	/**
	 * Decrease the thickness
	 *
	 * @param {number} step     The amount of the decrease
	 *                          (e.g. `.decreaseThickness(1)`
	 *                          will decrease the thickness by 1 pixel)
	 */
	Whiteboard.prototype.decreaseThickness = function(step) {
		_thickness -= step;

		if (_thickness < THICKNESS_MIN) {
			_thickness = THICKNESS_MIN;
		}
	};

	Object.defineProperty(Whiteboard.prototype, "color", {
		set: function(newValue) { _color = newValue; },
		get: function() { return _color; }
	});

	Object.defineProperty(Whiteboard.prototype, "thickness", {
		set: function(newValue) { _thickness = newValue; },
		get: function() { return _thickness; }
	});

	return Whiteboard;
})(jQuery, window);
