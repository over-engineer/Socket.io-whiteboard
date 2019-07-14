class Whiteboard {
    _thicknessMin = 1;
    _thicknessMax = 120;

    socketEvents = {
        DRAW: 'DRAW',
        DRAW_BEGIN_PATH: 'DRAW_BEGIN_PATH'
    };

    /**
     * Constructor
     *
     * @param {HTMLElement} canvas          The canvas element
     * @param {socket} socket               The socket.io socket
     * @param {string} [color='#4d4d4d']    The default color
     * @param {number} [thickness=4]        The default thickness
     */
    constructor(canvas, socket, color = '#4d4d4d', thickness = 4) {
        this.canvas = canvas;
        this.socket = socket;
        this.color = color;
        this.thickness = thickness;

        this.ctx = this.canvas.getContext('2d');

        canvas.addEventListener('mousedown', () => {
            this.ctx.beginPath();
            this.socket.emit(this.socketEvents.DRAW_BEGIN_PATH);
        });

        canvas.addEventListener('mousemove', (e) => {
            // Check whether we're holding the left click down while moving the mouse
            if (e.buttons === 1) {
                this._draw(e);
            }
        });

        this._resizeCanvas();
        window.addEventListener('resize', this._resizeCanvas);

        this.socket.on(this.socketEvents.DRAW, this._socketDraw);
        this.socket.on(this.socketEvents.DRAW_BEGIN_PATH, () => this.ctx.beginPath());
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
     *
     * @private
     */
    _resizeCanvas() {
        const { canvas, ctx } = this;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Clear the canvas for the browser that don't fully clear it
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    /**
     * Get the mouse input and draw on our canvas
     *
     * @param {MouseEvent} e    The mousemove event
     * @private
     */
    _draw(e) {
        const { canvas, ctx, color, thickness, socket, socketEvents } = this;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineTo(x, y);
        ctx.stroke();

        socket.emit(socketEvents.DRAW, { x, y, color, thickness });
    }

    /**
     * Get the drawing data from the socket and basically
     * draw on our canvas whatever the other person draws
     *
     * @param {Object} data     The drawing data
     * @private
     */
    _socketDraw(data) {
        const { ctx } = this;

        ctx.strokeStyle = data.color;
        ctx.lineWidth = data.thickness;
        ctx.lineTo(data.x, data.y);
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();
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
    download(filename) {
        const lnk = document.createElement('a');
        lnk.download = filename;
        lnk.href = this.canvas.toDataURL();

        if (document.createEvent) {
            const e = document.createEvent('MouseEvents');
            e.initMouseEvent('click', true, true, window,
                0, 0, 0, 0, 0, false,
                false, false, false, 0, null);

            lnk.dispatchEvent(e);
        } else if (lnk.fireEvent) {
            lnk.fireEvent('onclick');
        }
    }

    /**
     * Increase the thickness
     *
     * @param {number} step     The amount of the increase
     *                          (e.g. `.increaseThickness(1)`
     *                          will increase the thickness by 1 pixel)
     */
    increaseThickness(step) {
        this.thickness += step;

        if (this.thickness > this._thicknessMax) {
            this.thickness = this._thicknessMax;
        }
    }

    /**
     * Decrease the thickness
     *
     * @param {number} step     The amount of the decrease
     *                          (e.g. `.decreaseThickness(1)`
     *                          will decrease the thickness by 1 pixel)
     */
    decreaseThickness(step) {
        this.thickness -= step;

        if (this.thickness < this._thicknessMin) {
            this.thickness = this._thicknessMin;
        }
    }
}
