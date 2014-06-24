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
            var match = level.mapSize.match(/^{w:([0-9]+),h:([0-9]+)}$/);
            console.log(match); /*Debug marker*/

            _c.setSize({w:match[1], h:match[2]});

            var tile2ground = function(id){
                var tile = tiles.filter(function(elem){
                    return elem.id == id;
                })[0];

                if(tile === undefined) return 0;

                return tile.ground;
            };


            _c.layers.clearBuffer();


            console.log("before loop"); /*Debug marker*/
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
            console.log("after loop"); /*Debug marker*/
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
            console.log("init finished"); /*Debug marker*/
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
         * @param unit an object formatted as follow: {(int) id[, (int) hp, (bool) sleeping, (bool) darkened]}
         */
        addUnit: function(x, y, unit){
            console.log("Log"); /*Debug marker*/
            unit = _c.setDefaultParams(unit, {
                hp: null,
                sleeping: false,
                darkened: false

            });

            unit.opacity = 0;
            unit.createdAt = new Date().getTime();

            _gr.map.units[x][y] = unit;
            console.log("Log end"); /*Debug marker*/
        },

        /**
         * move a unit according to a specific path. The function will not return until the animation is complete.
         * @param x
         * @param y
         * @param path [{x, y}, {x, y}, ...]
         */
        moveUnit: function(x, y, path){
            _gr.global.movingUnit.unit = _gr.map.units[x][y];
            _gr.map.units[x][y] = null;

            _gr.global.movingUnit.x = x;
            _gr.global.movingUnit.y = y;
            _gr.global.movingUnit.path = path;
            _gr.global.movingUnit.currentNode = 0;

            while(_gr.global.movingUnit.currentNode < path.length);

            var lastNode = path[path.length - 1];
            _gr.map.units[lastNode.x][lastNode.y] = _gr.global.movingUnit.unit;
            _gr.global.movingUnit.unit = null;
        },

        /**
         * kill a unit and play the animation. The function will not return until the animation is complete.
         * @param x
         * @param y
         */
        killUnit: function(x, y){
            // TODO
        },

        /**
         * play an attack animation. The function will not return until the animation is complete.
         * @param attacker {x, y}
         * @param target {x, y}
         */
        attackUnit: function(attacker, target){
            // TODO
        },

        /**
         * show the defense animation for a specific unit. The function will not return until the animation is complete.
         * @param x
         * @param y
         */
        showDefenseAnim: function(x, y){
            // TODO
        },

        /**
         * show the assassin animation for a specific unit. The function will not return until the animation is complete.
         * @param x
         * @param y
         */
        showAssassinAnim: function(x, y){
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
            // TODO
        },

        /**
         * unhighlight a specific cell
         * @param x
         * @param y
         */
        unHighlightCell: function(x, y){
            // TODO
        },

        /**
         * unhighlight all cells
         */
        unHighlightAll: function(){
            // TODO
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
                    unit.opacity = Math.min(1, e.time - unit.createdAt / 1000);

                    _c.layers.buffer.save();
                    _c.layers.buffer.globalAlpha = unit.opacity;

                    _c.layers.drawUnit({
                        unit: unit,
                        x: x, y: y
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
                        x: x, y: y
                    });
                }
            }
        }

        /**
         * Moving unit
         */
        if(_gr.global.movingUnit.unit !== null){
            var u = _gr.global.movingUnit;

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

                move.x *= e.delta;
                move.y *= e.delta;

                if(Math.abs(toTarget.x) < Math.abs(move.x)) move.x = toTarget.x;
                if(Math.abs(toTarget.y) < Math.abs(move.y)) move.y = toTarget.y;

                u.x += move.x;
                u.y += move.y;
            }

            _c.layers.drawUnit({
                unit: u.unit,
                x: u.x,
                y: u.y
            });
        }

        _c.layers.blitBuffer(_c.layers.units, true);
    });
});