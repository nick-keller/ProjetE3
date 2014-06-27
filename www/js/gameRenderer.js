$(function(){
    window._gr = {
        map: {
            units: [],
            highlightedArea: [],
            ground: []
        },

        global: {
            movingUnit: {
                unit: null,
                x:0, y:0,
                path: null,
                currentNode: 0
            },
            darkenedUnits: []
        },

        /**
         * automaticaly called once
         */
        init: function(){
            var val = level.mapSize.split(",");

            _c.setSize({w:val[0], h:val[1]});

            var tile2ground = function(id){
                var tile = tiles.filter(function(elem){
                    return elem.id == id;
                })[0];

                if(tile === undefined) return 0;

                return tile.ground;
            };


            _c.layers.clearBuffer();

            for(var i=0; _c.const.world.grid.w > i; i++){
                _gr.map.units.push([]);
                _gr.map.highlightedArea.push([]);
                _gr.map.ground.push([]);
                for(var j=0; _c.const.world.grid.h > j; j++){
                    _gr.map.units[i].push(null);
                    _gr.map.highlightedArea[i].push(null);
                    _gr.map.ground[i].push(tile2ground(level.tiles[i][j]));

                    _c.layers.drawTile({
                        tileId: level.tiles[i][j],
                        x: i, y: j
                    });
                }
            }
            _c.layers.blitBuffer(_c.layers.background, true);

            // load buildings
            _c.layers.clearBuffer();
            for(var i=0; i<_c.const.world.grid.w; ++i){
                for(var j=0; j<_c.const.world.grid.h; ++j){
                    _c.layers.drawBuilding({
                        buildingId: level.buildings[i][j],
                        x: i, y: j
                    });
                }
            }
            _c.layers.blitBuffer(_c.layers.buildings, true);
        },

        /**
         *
         * @param btns an array of butons {(string) name, (bool) disabled, (func) callback}
         */
        showMenu: function(btns){

        },

        /**
         * sends a string to the other player via the server
         * see also: receiveStr
         * @param str the string to send
         */
        sendStr: function(str){
            $url = $('#game-container').data('send-str');

            $.get($url, {msg: str});
        },

        /**
         * check to see if the other player sent a string via the sendStr method.
         * If onNoMessage is not specified, this method will keep sending request to the server until a message is found
         * @param onSuccess callback when a message is found with the message as parameter
         * @param onNoMessage callback when no message is found
         */
        receiveStr: function(onSuccess, onNoMessage){
            if(onNoMessage == undefined)
                onNoMessage = function(){
                    _gr.receiveStr(onSuccess);
                };

            $url = $('#game-container').data('receive-str');

            $.get($url, null, function(data){
                if(data === null)
                    onNoMessage();
                else{
                    onSuccess(data.message);
                }
            }, 'json');
        },

        /**
         * returns true if the player initiated the game and false if he was invited to play
         */
        isMaster: function(){
            return $('#game-container').data('is-master') == 1;
        },

        /**
         * add a unit to a specific point on the map.
         * if a unit is already on the specified location it will be replaced
         * @param x
         * @param y
         * @param unit an object formatted as follow: {(int) id, (str) color[, (int) hp, (bool) sleeping, (bool) darkened]}
         */
        addUnit: function(x, y, unit){
            unit = _c.setDefaultParams(unit, {
                hp: null,
                color: "red",
                sleeping: false,
                darkened: false,
                dir: "right"

            });

            unit.opacity = 0;
            unit.createdAt = new Date().getTime();

            _gr.map.units[x][y] = unit;
        },

        /**
         * move a unit according to a specific path
         * @param x
         * @param y
         * @param path [{x, y}, {x, y}, ...]
         * @param callback
         */
        moveUnit: function(x, y, path, callback){
            console.log(path);
            _gr.global.movingUnit.unit = _gr.map.units[x][y];
            _gr.map.units[x][y] = null;

            _gr.global.movingUnit.x = x;
            _gr.global.movingUnit.y = y;
            _gr.global.movingUnit.path = path;
            _gr.global.movingUnit.currentNode = 0;
            _gr.global.movingUnit.callback = callback;
        },

        /**
         * kill a unit and play the animation. The function will not return until the animation is complete.
         * @param x
         * @param y
         * @param callback
         */
        killUnit: function(x, y, callback){
            _gr.map.units[x][y] = null;

            if(callback != undefined)
            callback();
            // TODO
        },

        /**
         * play an attack animation. The function will not return until the animation is complete.
         * @param attacker {x, y}
         * @param target {x, y}
         * @param callback
         */
        attackUnit: function(attacker, target, callback){
            if(callback != undefined)
            callback();
            // TODO
        },

        /**
         * show the defense animation for a specific unit. The function will not return until the animation is complete.
         * @param x
         * @param y
         * @param callback
         */
        showDefenseAnim: function(x, y, callback){
            if(callback != undefined)
            callback();
            // TODO
        },

        /**
         * show the assassin animation for a specific unit. The function will not return until the animation is complete.
         * @param x
         * @param y
         * @param callback
         */
        showAssassinAnim: function(x, y, callback){
            if(callback != undefined)
            callback();
            // TODO
        },

        /**
         * highlight a specific cell forever.
         * @param x
         * @param y
         * @param color1 the main color
         * @param color2 if specified, the highlight will alternate between color1 and color2
         */
        highlightCell: function(x, y, color1, color2){
            var c1 = tinycolor(color1);
            var c2 = tinycolor(color2);

            if(color2 == undefined || color2 == null){
                c2 = tinycolor(c1.toRgb());
                c2.setAlpha(0);
            }

            if(color1 == undefined || color1 == null){
                c1 = tinycolor(c2.toRgb());
                c1.setAlpha(0);
            }

            _gr.map.highlightedArea[x][y] = {c1: c1,c2:c2};
        },

        /**
         * unhighlight a specific cell
         * @param x
         * @param y
         */
        unHighlightCell: function(x, y){
            _gr.map.highlightedArea[x][y] = null;
        },

        /**
         * unhighlight all cells
         */
        unHighlightAll: function(){
            for(var x=0; x<_c.const.world.grid.w; ++x){
                for(var y=0; y<_c.const.world.grid.h; ++y){
                    _gr.map.highlightedArea[x][y] = null;
                }
            }
        },

        /**
         * set if a unit is sleeping or not
         * @param x
         * @param y
         * @param sleeping
         */
        setSleeping: function(x, y, sleeping){
            _gr.map.units[x][y].sleeping = sleeping;
        },

        /**
         * set the number to be displayed on the unit
         * @param x
         * @param y
         * @param hp number to be displayed. null to hide
         */
        setHP: function(x, y, hp){
            _gr.map.units[x][y].hp = hp;
        },

        /**
         * darken a specific unit
         * @param x
         * @param y
         */
        darkenUnit: function(x, y){
            _gr.map.units[x][y].darkened = true;
            _gr.global.darkenedUnits.push(_gr.map.units[x][y]);
        },

        /**
         * undarken all units
         */
        undarkenAll: function(){
            for(var i=_gr.global.darkenedUnits.length; i--; ){
                _gr.global.darkenedUnits[i].darkened = false;
                _gr.global.darkenedUnits.pop();
            }
        }
    };

    _c.init($('.game-renderer .playground'));
    _gr.init();

    _c.render(function(e){
        _c.layers.clearBuffer();

        var unit;

        /**
         * Loop for units
         */
        for(var x=0; x<_c.const.world.grid.w; ++x){
            for(var y=0; y<_c.const.world.grid.h; ++y){
                if(_gr.map.units[x][y] == null) continue;

                unit = _gr.map.units[x][y];

                // Fade in animation
                if(unit.hasOwnProperty("opacity")){
                    unit.opacity = Math.min(1, (e.time - unit.createdAt) / 1000);

                    _c.layers.buffer.save();
                    _c.layers.buffer.globalAlpha = unit.opacity;

                    _c.layers.drawUnit({
                        unit: unit,
                        x: x, y: y,
                        frame: e.animLoop
                    });

                    _c.layers.buffer.restore();

                    if(unit.opacity == 1){
                        delete unit.opacity;
                        delete unit.createdAt;
                    }
                }
                else{
                    _c.layers.drawUnit({
                        unit: unit,
                        x: x, y: y,
                        frame: e.animLoop
                    });
                }
            }
        }

        /**
         * Moving unit
         */
        if(_gr.global.movingUnit.unit !== null){
            var u = _gr.global.movingUnit;

            if(u.currentNode == u.path.length){
                _c.layers.drawUnit({
                    unit: u.unit,
                    x: u.x,
                    y: u.y,
                    frame: e.animLoop
                });

                var lastNode = u.path[u.path.length - 1];
                _gr.map.units[lastNode.x][lastNode.y] = u.unit;
                _gr.global.movingUnit.unit = null;

                if(_gr.global.movingUnit.callback != undefined)
                    _gr.global.movingUnit.callback();
            }
            else{

                // We reached the node, let's move to the next one
                if(u.x == u.path[u.currentNode].x && u.y == u.path[u.currentNode].y)
                    u.currentNode++;

                // We did not reach the last one yet
                if(u.currentNode < u.path.length){
                    var target = u.path[u.currentNode];

                    var toTarget = {
                        x: target.x - u.x,
                        y: target.y - u.y
                    };

                    var move = {
                        x: toTarget.x == 0 ? 0 : toTarget.x > 0 ? 1 : -1,
                        y: toTarget.y == 0 ? 0 : toTarget.y > 0 ? 1 : -1
                    };

                    move.x *= e.delta * 5;
                    move.y *= e.delta * 5;

                    if(Math.abs(toTarget.x) < Math.abs(move.x)) move.x = toTarget.x;
                    if(Math.abs(toTarget.y) < Math.abs(move.y)) move.y = toTarget.y;

                    u.x += move.x;
                    u.y += move.y;

                    if(move.x > 0) u.unit.dir = "right";
                    if(move.x < 0) u.unit.dir = "left";
                    if(move.y > 0) u.unit.dir = "down";
                    if(move.y < 0) u.unit.dir = "up";
                }
                _c.layers.drawUnit({
                    unit: u.unit,
                    x: u.x,
                    y: u.y,
                    frame: e.animLoop
                });
            }
        }

        _c.layers.blitBuffer(_c.layers.units, true);


        _c.layers.clearBuffer();

        /**
         * Loop for highlight
         */
        var area;
        for(var x=0; x<_c.const.world.grid.w; ++x){
            for(var y=0; y<_c.const.world.grid.h; ++y){
                area = _gr.map.highlightedArea[x][y];
                if(area == null) continue;

                _c.layers.drawRect({
                    x: x*32, y: y*32,
                    w:33, h:33,
                    fill: tinycolor.mix(area.c1, area.c2, e.halfLoop*100).toRgbString(),
                    stroke: tinycolor.darken(tinycolor.mix(area.c1, area.c2, e.halfLoop*100), 60).toRgbString()
                })
            }
        }
        _c.layers.blitBuffer(_c.layers.ui, true);
    });

//    _gr.addUnit(0,0,{id:2});
//    _gr.addUnit(0,1,{id:1});
//    _gr.addUnit(1,3,{id:1});
//    _gr.highlightCell(1, 0, "rgba(188,54,54,.6)");
//    _gr.highlightCell(1, 1, "rgba(188,54,54,.6)");
//    _gr.highlightCell(2, 0, "rgba(188,54,54,.6)", "rgba(54,148,188,.6)");
//    _gr.highlightCell(3, 0, null, "rgba(54,148,188,.6)");
//    _gr.highlightCell(2, 1, null, "rgba(54,148,188,.6)");
//    setTimeout(function(){
//        _gr.unHighlightAll();
//        _gr.moveUnit(0, 0, [
//            {x:0, y:2},
//            {x:1, y:2},
//            {x:1, y:3},
//            {x:3, y:3},
//            {x:3, y:1},
//            {x:1, y:1}
//        ], function(){
//            _gr.darkenUnit(1, 1);
//            _gr.moveUnit(0, 1, [
//                {x:2, y:1},
//                {x:2, y:4},
//                {x:0, y:4},
//                {x:0, y:3}
//            ], function(){
//                _gr.darkenUnit(0, 3);
//                setTimeout(function(){
//                    _gr.undarkenAll();
//                }, 2000);
//            })
//        });
//    }, 4000);
});