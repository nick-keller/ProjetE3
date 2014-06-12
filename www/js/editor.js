$(function(){
    var _e = {
        current: {
            editorMode: null,
            tile: 1,
            tileFamily: 1,
            building: 1
        },
        map: {
            family: [],
            tile: [],
            building: []
        }
    };

    _c.init($('.map-editor .playground'));

    var $menu = $('.map-editor .menu');

    $('#input-map-size').change(function(){
        var val = $(this).val().split(",");

        _c.setSize({w:val[0], h:val[1]});
        _e.map = {
            family: [],
            tile: [],
            building: []
        };

        for(var i=0; i<_c.const.world.grid.w; ++i){
            _e.map.family.push([]);
            _e.map.tile.push([]);
            _e.map.building.push([]);
            for(var j=0; j<_c.const.world.grid.h; ++j){
                _e.map.family[i].push(0);
                _e.map.tile[i].push(0);
                _e.map.building[i].push(0);
            }
        }
    }).change();

    $menu.find('.tile').click(function(){
        var $this = $(this);
        $menu.find('.tile').removeClass('active');
        $this.addClass('active');

        _e.current.tile = $this.data('id');
        _e.current.tileFamily = $this.data('family');
    });

    $menu.find('.building').click(function(){
        var $this = $(this);
        $menu.find('.building').removeClass('active');
        $this.addClass('active');

        _e.current.building = $this.data('id');
    });

    $menu.find('[data-tab-container="main-menu"] [data-target]').click(function(){
        var $this = $(this);

        _e.current.editorMode = $this.data('target');
    });

    _c.mousemove(function(e){

        if(_e.current.editorMode == 'ground'){
            _c.layers.clearBuffer();

            if(e.mouseDown == false){
                _c.layers.drawRect({
                    x: e.grid.x *32, y: e.grid.y *32, w: 32, h: 32,
                    fill: 'rgba(0,255,0,.3)',
                    stroke: 'rgba(0,255,0,.7)'
                });
            }
            else{
                _c.layers.drawRect({
                    x: e.min.grid.x *32, y: e.min.grid.y *32,
                    w: (e.max.grid.x-e.min.grid.x+1) *32, h: (e.max.grid.y-e.min.grid.y+1) *32,
                    fill: 'rgba(0,255,0,.3)',
                    stroke: 'rgba(0,255,0,.7)'
                });
            }
            _c.layers.blitBuffer(_c.layers.ui, true);
        }

        if(_e.current.editorMode == 'buildings'){
            _c.layers.clearBuffer();

            if(_e.map.building[e.grid.x][e.grid.y] == 0){
                _c.layers.drawRect({
                    x: e.grid.x *32, y: e.grid.y *32, w: 32, h: 32,
                    fill: 'rgba(0,255,0,.3)',
                    stroke: 'rgba(0,255,0,.7)'
                });

                _c.layers.drawBuilding({
                    x: e.grid.x, y: e.grid.y,
                    buildingId: _e.current.building
                });
            }
            else{
                _c.layers.drawRect({
                    x: e.grid.x *32, y: e.grid.y *32, w: 32, h: 32,
                    fill: 'rgba(255,0,0,.3)',
                    stroke: 'rgba(255,0,0,.7)'
                });
            }

            _c.layers.blitBuffer(_c.layers.ui, true);
        }
    });

    _c.mouseup(function(e){

        if(_e.current.editorMode == 'ground' && e.btn == 1){

            _c.layers.clearLayer(_c.layers.ui);
            _c.layers.clearBuffer();

            for(var i=e.min.grid.x; i<=e.max.grid.x; ++i){
                for(var j=e.min.grid.y; j<=e.max.grid.y; ++j){

                    // Magic wand
                    if(_e.current.tile == 0){
                        var type = 4; // center
                        if(i == e.min.grid.x && j == e.min.grid.y) type = 0; // top left
                        else if(i == e.min.grid.x && j == e.max.grid.y) type = 6; // bottom left
                        else if(i == e.max.grid.x && j == e.min.grid.y) type = 2; // top right
                        else if(i == e.max.grid.x && j == e.max.grid.y) type = 8; // bototm right
                        else if(i == e.min.grid.x) type = 3; // left
                        else if(i == e.max.grid.x) type = 5; // right
                        else if(j == e.min.grid.y) type = 1; // top
                        else if(j == e.max.grid.y) type = 7; // bottom

                        // on the edge of the rectangle, or edge of the world
                        if(type != 4 && _e.map.family[i][j] == _e.current.tileFamily || i*j == 0 || i == _c.const.world.grid.w -1 || j == _c.const.world.grid.h -1){
                            var sides = [0,0,0,0,1,0,0,0,0];

                            if(i == 0 || j == 0 || (i > e.min.grid.x && j > e.min.grid.y) || _e.map.family[i-1][j-1] == _e.current.tileFamily)
                                sides[0] = 1;
                            if(j == 0 || j > e.min.grid.y || _e.map.family[i][j-1] == _e.current.tileFamily)
                                sides[1] = 1;
                            if(i == _c.const.world.grid.w -1 || j == 0 || (i < e.max.grid.x && j > e.min.grid.y) || _e.map.family[i+1][j-1] == _e.current.tileFamily)
                                sides[2] = 1;
                            if(i == 0 || i > e.min.grid.x || _e.map.family[i-1][j] == _e.current.tileFamily)
                                sides[3] = 1;
                            if(i == _c.const.world.grid.w -1 || i < e.max.grid.x || _e.map.family[i+1][j] == _e.current.tileFamily)
                                sides[5] = 1;
                            if(i == 0 || j == _c.const.world.grid.h -1 || (i > e.min.grid.x && j < e.max.grid.y) || _e.map.family[i-1][j+1] == _e.current.tileFamily)
                                sides[6] = 1;
                            if(j == _c.const.world.grid.h -1 || j < e.max.grid.y || _e.map.family[i][j+1] == _e.current.tileFamily)
                                sides[7] = 1;
                            if(i == _c.const.world.grid.w -1 || j == _c.const.world.grid.h -1 || (i < e.max.grid.x && j < e.max.grid.y) || _e.map.family[i+1][j+1] == _e.current.tileFamily)
                                sides[8] = 1;

                            if(sides[0] + sides[2] + sides[6] + sides[8] == 3 && sides[1] + sides[3] + sides[5] + sides[7] == 4){
                                if(sides[0] == 0) type = 12;
                                else if(sides[2] == 0) type = 11;
                                else if(sides[6] == 0) type = 10;
                                else if(sides[8] == 0) type = 9;
                            }
                            else if(sides[1] + sides[3] + sides[5] + sides[7] == 3){
                                if(sides[1] == 0) type = 1;
                                else if(sides[3] == 0) type = 3;
                                else if(sides[5] == 0) type = 5;
                                else if(sides[7] == 0) type = 7;
                            }
                            else if(sides[1] + sides[3] + sides[5] + sides[7] == 2){
                                if(sides[1] + sides[5] == 2) type = 6;
                                else if(sides[7] + sides[5] == 2) type = 0;
                                else if(sides[7] + sides[3] == 2) type = 2;
                                else if(sides[1] + sides[3] == 2) type = 8;
                                else type = 4;
                            }
                            else if(sides[1] + sides[3] + sides[5] + sides[7] == 1){
                                if(sides[1] == 1) type = 7;
                                else if(sides[3] == 1) type = 5;
                                else if(sides[5] == 1) type = 3;
                                else if(sides[7] == 1) type = 1;
                            }
                            else
                                type = 4;
                        }

                        // get the tile
                        var tile = _c.const.data.tiles.filter(function(e){
                            return e.family == _e.current.tileFamily && e.type == type;
                        });

                        // This family does not have this type of tile, we use the center tile
                        if(tile.length == 0){
                            tile = _c.const.data.tiles.filter(function(e){
                                return e.family == _e.current.tileFamily && e.type == 4;
                            });
                        }

                        // Still no tile, continue
                        if(tile.length == 0) continue;

                        // get a random tile
                        if(tile[0].distribution == 0)
                            tile = tile[Math.floor((Math.random() * tile.length))];

                        // get a checker patern tile
                        else{
                            var distrib = 0;
                            if((Math.floor(i/2)+j)%2 == 0 && i%2 == 0) distrib = 1;
                            else if((Math.floor(i/2)+j)%2 == 0 && i%2 == 1) distrib = 2;
                            else if((Math.floor(i/2)+j)%2 == 1 && i%2 == 0) distrib = 3;
                            else if((Math.floor(i/2)+j)%2 == 1 && i%2 == 1) distrib = 4;

                            tile = _c.const.data.tiles.filter(function(e){
                                return e.family == _e.current.tileFamily && e.type == 4 && e.distribution == distrib;
                            })[0];
                        }

                        _c.layers.drawTile({
                            tileId: tile.id,
                            x: i, y: j
                        });

                        _e.map.family[i][j] = tile.family;
                        _e.map.tile[i][j] = tile.id;
                    }
                    else{
                        _c.layers.drawTile({
                            tileId: _e.current.tile,
                            x: i, y: j
                        });

                        _e.map.family[i][j] = _e.current.tileFamily;
                        _e.map.tile[i][j] = _e.current.tile;
                    }
                }
            }
            _c.layers.blitBuffer(_c.layers.background);
        }

    });

    _c.mouseout(function(){

        if(_e.current.editorMode == 'ground' || _e.current.editorMode == 'buildings'){

            _c.layers.clearLayer(_c.layers.ui);
        }
    });

    _c.mousedown(function(e){

        if(_e.current.editorMode == 'ground'){

            if(e.btn == 3){
                if(_e.current.tile == 0){
                    _e.current.tileFamily = _e.map.family[e.grid.x][e.grid.y];
                }
                else{
                    _e.current.tile = _e.map.tile[e.grid.x][e.grid.y];
                }
            }
        }

        if(_e.current.editorMode == 'buildings'){

            if(e.btn == 3){
                _e.current.building = _e.map.building[e.grid.x][e.grid.y];
            }

            if(e.btn == 1){
                var drawBuilding = function(x, y){
                    do{
                        _c.layers.drawBuilding({
                            x: x, y: y,
                            buildingId: _e.map.building[x][y]
                        });
                        y++;
                    }while(y < _c.const.world.grid.h && _e.map.building[x][y] > 0);
                };

                if(_e.map.building[e.grid.x][e.grid.y] != 0){
                    if(_e.current.building != 0) return;
                    _c.layers.clearBuffer();

                    _e.map.building[e.grid.x][e.grid.y] = 0;

                    if(e.grid.y > 0)
                        _c.layers.drawBuilding({
                            x: e.grid.x, y: e.grid.y - 1,
                            buildingId: _e.map.building[e.grid.x][e.grid.y - 1]
                        });

                    if(e.grid.y < _c.const.world.grid.h)
                        drawBuilding(e.grid.x, e.grid.y+1);

                    _c.layers.buildings.clearRect(32*e.grid.x, 32*e.grid.y - 32, 32, 64);
                    _c.layers.blitBuffer(_c.layers.buildings);
                }
                else{
                    _c.layers.clearLayer(_c.layers.ui);
                    _c.layers.clearBuffer();

                    _e.map.building[e.grid.x][e.grid.y] = _e.current.building;
                    drawBuilding(e.grid.x, e.grid.y);

                    _c.layers.blitBuffer(_c.layers.buildings);
                }
            }
        }
    });
});