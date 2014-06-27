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

window._c = {
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

        },
        render: {
            prevTime: 0
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
            layer.save();

            if(clearFirst == true)
                layer.globalCompositeOperation = "copy";
            layer.drawImage(_c.canvas.buffer[0], 0, 0);

            layer.restore();
        },

        /**
         * draw a rectangle
         * default params: {layer:buffer, x:0, y:0, w:32, h:32, fill:null, stroke:null, strokeWidth:1}
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

        /**
         * draw a tile in grid unit
         * default params: {layer:buffer, tileId:1, x:0, y:0}
         * @param params parameters of the tile to be drawn
         */
        drawTile: function(params){
            params = _c.setDefaultParams(params, {
                layer: _c.layers.buffer,
                tileId: 1,
                x: 0, y: 0
            });

            var tile = _c.const.data.tiles.filter(function(e){
                return e.id == params.tileId;
            });

            if(tile.length != 1) return;
            tile = tile[0];

            params.layer.drawImage(_c.const.textures.tiles, tile.x * 32, tile.y * 32, 32, 32, params.x * 32,  params.y * 32, 32, 32);
        },

        /**
         * draw a building in grid unit
         * default params: {layer:buffer, buildingId:1, x:0, y:0}
         * @param params parameters of the building to be drawn
         */
        drawBuilding: function(params){
            params = _c.setDefaultParams(params, {
                layer: _c.layers.buffer,
                buildingId: 1,
                x: 0, y: 0
            });

            var building = _c.const.data.buildings.filter(function(e){
                return e.id == params.buildingId;
            });

            if(building.length != 1) return;
            building = building[0];

            params.layer.drawImage(_c.const.textures.buildings, building.x * 32, building.y * 64, 32, 64, params.x * 32,  params.y * 32-32, 32, 64);
        },

        /**
         * draw a unit in grid unit
         * default params: {layer:buffer, unit:{id:1}, x:0, y:0, frame:0}
         * @param params parameters of the unit to be drawn
         */
        drawUnit: function(params){
            params = _c.setDefaultParams(params, {
                layer: _c.layers.buffer,
                x: 0, y: 0,
                frame: 0
            });

            // find unit
            var unit = _c.const.data.units.filter(function(e){
                return e.id == params.unit.id;
            });

            if(params.unit.sleeping){
                params.frame = 1;
            }

            if(unit.length != 1) return;
            unit = unit[0];

            // if we need to darken the unit we have to use buffer2
            var realLayer = params.layer;
            if(params.unit.darkened){
                _c.layers.clearLayer(_c.layers.buffer2);
                params.layer = _c.layers.buffer2;
            }

            params.layer.save();

            if(params.unit.dir == "right"){
                params.layer.translate(params.x * 64 + 32, 0);
                params.layer.scale(-1,1);
            }

            // vertical offset
            var offset = 0;
            if(params.unit.dir == "up") offset = 2;
            if(params.unit.dir == "down") offset = 1;

            // horizontal offset
            var hOffset = params.unit.color == "red" ? 0 : 768;

            params.layer.drawImage(_c.const.textures.units, unit.x * 192 + 64*params.frame + hOffset, unit.y * 192 + 64*offset, 64, 64, params.x * 32 - 16,  params.y * 32-32, 64, 64);

            params.layer.restore();
            params.layer.save();

            if(params.unit.darkened){
                params.layer.globalCompositeOperation = "source-atop";
                _c.layers.drawRect({
                    layer: params.layer,
                    x: params.x*32 -16,
                    y: params.y*32 -32,
                    w: 64, h: 64,
                    fill: "rgba(0,0,0,.4)"
                });

                realLayer.drawImage(_c.canvas.buffer2[0], 0, 0);
                params.layer.restore();
                params.layer = realLayer;
                params.layer.save();
            }

            if(params.unit.hp != null){
                _c.layers.drawRect({
                    x: params.x*32 + 32 - 7,
                    y: params.y*32 + 32 - 9,
                    w: 7,
                    h: 9,
                    fill: "black"
                });

                params.layer.font="10px Arial";
                params.layer.textAlign ="center";
                params.layer.fillStyle = "white";
                params.layer.fillText(params.unit.hp,params.x*32 + 29,params.y*32 + 31);
            }

            params.layer.restore();
        }
    },

    /**
     * callback methods for events
     */
    callbacks: {
        mousedown: [],
        mousemove: [],
        mouseup: [],
        mouseout: [],
        render: []
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
        _c.const.textures.buildings = new Image();
        _c.const.textures.buildings.src = 'http://localhost/ProjetE3/www/spritesheet/buildingsx2.png';
        _c.const.textures.units = new Image();
        _c.const.textures.units.src = 'http://localhost/ProjetE3/www/spritesheet/unitsx2.png';
        _c.const.data.tiles = tiles;
        _c.const.data.tileFamily = tileFamily;
        _c.const.data.buildings = buildings;
        _c.const.data.units = units;

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

        var render = function(){
            var time = new Date().getMilliseconds() / 1000;
            var currentTime = new Date().getTime();

            var event = {
                loop: time,
                halfLoop: Math.cos(time*6.28)/2+0.5,
                animLoop: Math.floor(time*4) == 3 ? 1 : Math.floor(time*4),
                delta: (currentTime - _c.const.render.prevTime) / 1000,
                time: currentTime
            };

            $.each(_c.callbacks.render, function(i, callback){
                callback(event);
            });

            _c.const.render.prevTime = currentTime;

            window.requestAnimFrame(render);
        };

        render();
    },

    /**
     * set the size of the level in grid units.
     * default: {w:20, h:12}
     * @param params size
     */
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

    /**
     * add a callback when a mouse btn is pushed down
     * 1: btn left
     * 2: btn midle
     * 3: btn right
     * event passed to callback:
     * {x, y, grid:{x, y}, (int) btn}
     * @param callback the callback method
     */
    mousedown: function(callback){
        _c.callbacks.mousedown.push(callback);
    },

    /**
     * add a callback when the mouse moves over the playground
     * event passed to callback:
     * {x, y, grid:{x, y}, (bool) mouseDown, (point) clickedAt, (point) min, (point) max}
     * @param callback the callback method
     */
    mousemove: function(callback){
        _c.callbacks.mousemove.push(callback);
    },

    /**
     * add a callback when a mouse btn is released
     * 1: btn left
     * 2: btn midle
     * 3: btn right
     * event passed to callback:
     * {x, y, grid:{x, y}, (int) btn, (point) clickedAt, (point) min, (point) max}
     * @param callback the callback method
     */
    mouseup: function(callback){
        _c.callbacks.mouseup.push(callback);
    },

    /**
     * add a callback when a mouse leaves the playground
     * no event is passed
     * @param callback the callback method
     */
    mouseout: function(callback){
        _c.callbacks.mouseout.push(callback);
    },

    /**
     * add a callback to the render pipeline. The callback will be called each time a new frame is calculated.
     * event passed to callback:
     * {(float) loop, (float) halfLoop, (float) delta, (int) time}
     * loop: goes from 0 to 1 in 1 sec and instantly goes back to 0.
     * halfLoop: goes from 0 to 1 in 0.5 sec and goes back to 0 in 0.5 sec.
     * delta: the number of seconds since last render
     * time: current time in miliseconds
     * @param callback the callback method
     */
    render: function(callback){
        _c.callbacks.render.push(callback);
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