window.requestAnimFrame = (function(){
    return window.requestAnimationFrame       || // La forme standardisée
        window.webkitRequestAnimationFrame || // Pour Chrome et Safari
        window.mozRequestAnimationFrame    || // Pour Firefox
        window.oRequestAnimationFrame      || // Pour Opera
        window.msRequestAnimationFrame     || // Pour Internet Explorer
        function(callback){                   // Pour les élèves du dernier rang
            window.setTimeout(callback, 1000 / 60);
        };
})();

var _c = {
    const: {
        world: {
            w: 640,
            h: 384,
            grid: {
                w: 20,
                h: 12
            }
        },
        textures: {
            tiles: null
        },
        data: {

        }
    },

    /**
     * the jQuery playground element
     */
    playground: null,

    /**
     * the jQuery canvas elements representing the different layers
     */
    canvas: {},

    /**
     * the context of the layers, used to draw
     */
    layers: {

        /**
         * clear a layer
         * @param layer the layer to clear
         * @param color if specified, the layer will be cleared using this color
         */
        clearLayer: function(layer, color){
            if(color == undefined)
                layer.clearRect(0, 0, _c.const.world.w, _c.const.world.h);
            else{
                layer.fillStyle = color;
                layer.fillRect(0, 0, _c.const.world.w, _c.const.world.h);
            }
        },

        /**
         * shortcut for clearLayer(buffer)
         */
        clearBuffer: function(){
            _c.layers.clearLayer(_c.layers.buffer);
        },

        /**
         * draw the buffer on a given layer
         * @param layer the layer to draw the buffer on
         * @param clearFirst if specified and true, the layer will be cleared first
         */
        blitBuffer: function(layer, clearFirst){
            if(clearFirst == true)
                _c.layers.clearLayer(layer);
            layer.drawImage(_c.canvas.buffer[0], 0, 0);
        },

        /**
         * draw a rectangle
         * @param params parameters of the rectangle
         */
        drawRect: function(params){
            params = _c.setDefaultParams(params, {
                layer: _c.layers.buffer,
                x:0, y:0, w:32, h:32,
                fill: null,
                stroke: null,
                strokeWidth: 1
            });

            params.layer.save();

            if(params.fill != null){
                params.layer.fillStyle = params.fill;
                params.layer.fillRect(params.x, params.y, params.w, params.h);
            }

            if(params.stroke != null){
                params.layer.strokeStyle = params.stroke;
                params.layer.lineWidth = params.strokeWidth;
                params.layer.strokeRect(params.x, params.y, params.w, params.h);
            }

            params.layer.restore();
        },

        drawTile: function(params){
            params = _c.setDefaultParams(params, {
                layer: _c.layers.buffer,
                tileId: 1,
                x: 0, y: 0
            });

            //http://localhost/ProjetE3/www/spritesheet/tilesx2.png
            var tile = _c.const.data.tiles.filter(function(e){
                return e.id == params.tileId;
            });

            if(tile.length != 1) return;
            tile = tile[0];

            params.layer.drawImage(_c.const.textures.tiles, tile.x * 32, tile.y * 32, 32, 32, params.x * 32,  params.y * 32, 32, 32);
        }
    },

    /**
     * callback methods for events
     */
    callbacks: {
        mousedown: [],
        mousemove: [],
        mouseup: [],
        mouseout: []
    },

    mouse: {
        /**
         * position of the click with the left mouse button
         * {x, y, grid:{x, y}}
         */
        clickedAt: null
    },

    /**
     * call this method once to init everything
     * @param playground the jQuery playground element
     */
    init: function(playground){
        _c.const.textures.tiles = new Image();
        _c.const.textures.tiles.src = 'http://localhost/ProjetE3/www/spritesheet/tilesx2.png';
        _c.const.data.tiles = tiles;
        _c.const.data.tileFamily = tileFamily;

        _c.playground = playground;
        var $canvas = _c.playground.find('canvas');

        $canvas.attr({
            width: _c.const.world.w + 'px',
            height: _c.const.world.h + 'px'
        });

        $canvas.each(function(){
            var $this = $(this);
            var name = $this.data('layer');
            _c.canvas[name] = $this;
            _c.layers[name] = _c.canvas[name][0].getContext('2d');
        });

        _c.playground.mousedown(function(e){
            var offset = _c.playground.offset();

            var event = {
                x: e.pageX - offset.left,
                y: e.pageY - offset.top,
                grid: {
                    x: Math.floor((e.pageX - offset.left)/32),
                    y: Math.floor((e.pageY - offset.top)/32)
                },
                btn: e.which
            };

            if(e.which == 1)
                _c.mouse.clickedAt = event;

            $.each(_c.callbacks.mousedown, function(i, callback){
                callback(event);
            });
        });

        _c.playground.mouseup(function(e){
            var offset = _c.playground.offset();

            var event = {
                x: e.pageX - offset.left,
                y: e.pageY - offset.top,
                grid: {
                    x: Math.floor((e.pageX - offset.left)/32),
                    y: Math.floor((e.pageY - offset.top)/32)
                },
                btn: e.which,
                clickedAt: _c.mouse.clickedAt
            };

            event.min = {
                x: Math.min(event.x, event.clickedAt.x),
                y: Math.min(event.y, event.clickedAt.y),
                grid: {
                    x: Math.min(event.grid.x, event.clickedAt.grid.x),
                    y: Math.min(event.grid.y, event.clickedAt.grid.y)
                }
            };

            event.max = {
                x: Math.max(event.x, event.clickedAt.x),
                y: Math.max(event.y, event.clickedAt.y),
                grid: {
                    x: Math.max(event.grid.x, event.clickedAt.grid.x),
                    y: Math.max(event.grid.y, event.clickedAt.grid.y)
                }
            };

            $.each(_c.callbacks.mouseup, function(i, callback){
                callback(event);
            });

            if(e.which == 1)
                _c.mouse.clickedAt = null;
        });

        _c.playground.mousemove(function(e){
            var offset = _c.playground.offset();

            var event = {
                x: e.pageX - offset.left,
                y: e.pageY - offset.top,
                grid: {
                    x: Math.floor((e.pageX - offset.left)/32),
                    y: Math.floor((e.pageY - offset.top)/32)
                },
                mouseDown: _c.mouse.clickedAt != null,
                clickedAt: _c.mouse.clickedAt
            };

            if(event.clickedAt != null){
                event.min = {
                    x: Math.min(event.x, event.clickedAt.x),
                    y: Math.min(event.y, event.clickedAt.y),
                    grid: {
                        x: Math.min(event.grid.x, event.clickedAt.grid.x),
                        y: Math.min(event.grid.y, event.clickedAt.grid.y)
                    }
                };

                event.max = {
                    x: Math.max(event.x, event.clickedAt.x),
                    y: Math.max(event.y, event.clickedAt.y),
                    grid: {
                        x: Math.max(event.grid.x, event.clickedAt.grid.x),
                        y: Math.max(event.grid.y, event.clickedAt.grid.y)
                    }
                };
            }

            $.each(_c.callbacks.mousemove, function(i, callback){
                callback(event);
            });
        });

        _c.playground.mouseout(function(e){
            $.each(_c.callbacks.mouseout, function(i, callback){
                callback();
            });
        });
    },

    mousedown: function(callback){
        _c.callbacks.mousedown.push(callback);
    },

    /**
     * add a callback when the mouse moves over the playground
     * {x, y, grid:{x, y}, mouseDown, clickedAt, min, max}
     * @param callback the callback method
     */
    mousemove: function(callback){
        _c.callbacks.mousemove.push(callback);
    },

    mouseup: function(callback){
        _c.callbacks.mouseup.push(callback);
    },

    mouseout: function(callback){
        _c.callbacks.mouseout.push(callback);
    },

    /**
     * Get a complete list of parameters by filling the gaps with default parameters
     * @param params the parameters to fill
     * @param defaultParams a list of default parameters
     * @returns the complete list of parameters
     */
    setDefaultParams: function(params, defaultParams){
        if (undefined == params) return defaultParams;
        for (var attr in params) defaultParams[attr] = params[attr];

        return defaultParams;
    }
};