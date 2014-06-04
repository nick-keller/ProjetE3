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
            offset: {
                x: 0,
                y: 0
            },
            grid: {
                w: 20,
                h: 12
            }
        },
        screen: {
            w: 640,
            h: 384
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
                x: e.pageX - offset.left - _c.const.world.offset.x,
                y: e.pageY - offset.top - _c.const.world.offset.y,
                btn: e.which
            };

            event.grid = {
                x: Math.floor(event.x/32),
                y: Math.floor(event.y/32)
            };

            if(e.which == 1)
                _c.mouse.clickedAt = event;

            if(e.which == 2){
                _c.const.world.offset.before = {
                    x: _c.const.world.offset.x,
                    y: _c.const.world.offset.y
                };

                _c.const.world.offset.clickedAt = {
                    x: e.pageX - offset.left,
                    y: e.pageY - offset.top
                };

                _c.playground.css('cursor', 'move');
            }

            $.each(_c.callbacks.mousedown, function(i, callback){
                callback(event);
            });

            return !(e.which == 3);
        });

        _c.playground[0].oncontextmenu = function() {return false;};

        _c.playground.mouseup(function(e){
            var offset = _c.playground.offset();

            var event = {
                x: e.pageX - offset.left - _c.const.world.offset.x,
                y: e.pageY - offset.top - _c.const.world.offset.y,
                btn: e.which,
                clickedAt: _c.mouse.clickedAt
            };

            event.grid = {
                x: Math.floor(event.x/32),
                y: Math.floor(event.y/32)
            };

            if(e.which == 1){
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

            $.each(_c.callbacks.mouseup, function(i, callback){
                callback(event);
            });

            if(e.which == 1)
                _c.mouse.clickedAt = null;

            if(e.which == 2){
                delete _c.const.world.offset.before;
                delete _c.const.world.offset.clickedAt;
                _c.playground.css('cursor', 'default');
            }
        });

        _c.playground.mousemove(function(e){
            var offset = _c.playground.offset();

            var event = {
                x: e.pageX - offset.left - _c.const.world.offset.x,
                y: e.pageY - offset.top - _c.const.world.offset.y,
                mouseDown: _c.mouse.clickedAt != null,
                clickedAt: _c.mouse.clickedAt
            };

            event.grid = {
                x: Math.floor(event.x/32),
                y: Math.floor(event.y/32)
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

            if(_c.const.world.offset.before !== undefined){
                var delta = {
                    x:e.pageX - offset.left - _c.const.world.offset.clickedAt.x,
                    y: e.pageY - offset.top - _c.const.world.offset.clickedAt.y
                };

                _c.const.world.offset.x = Math.max(-_c.const.world.w + _c.const.screen.w, Math.min(0, _c.const.world.offset.before.x + delta.x));
                _c.const.world.offset.y = Math.max(-_c.const.world.h + _c.const.screen.h, Math.min(0, _c.const.world.offset.before.y + delta.y));

                _c.playground.find('canvas').css({
                    top: _c.const.world.offset.y+'px',
                    left: _c.const.world.offset.x+'px'
                });

                _c.playground.css('background-position', (-1 + _c.const.world.offset.x) + 'px ' + (-1 + _c.const.world.offset.y) + 'px, ' +(-1 + _c.const.world.offset.x) + 'px ' + (-1 + _c.const.world.offset.y) + 'px, ' + _c.const.world.offset.x + 'px ' + _c.const.world.offset.y + 'px, ' + _c.const.world.offset.x + 'px ' + _c.const.world.offset.y + 'px');
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

    setSize: function(params){
        params = _c.setDefaultParams(params, {
            w: 20, h:12
        });

        _c.const.world = {
            w: params.w * 32,
            h: params.h * 32,
            grid: {
                w: params.w,
                h: params.h
            },
            offset: _c.const.world.offset
        };

        var $canvas = _c.playground.find('canvas');

        $canvas.attr({
            width: _c.const.world.w + 'px',
            height: _c.const.world.h + 'px'
        });

        $canvas.css({
            width: _c.const.world.w + 'px',
            height: _c.const.world.h + 'px'
        })
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