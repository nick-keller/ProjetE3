$(function(){
    var _gr = {
        map: {
            units: [],
            highlightedArea: []
        },

        /**
         * add a unit to a specific point on the map.
         * if a unit is already on the specified location it will be replaced
         * @param x
         * @param y
         * @param unit an object formatted as follow: {(int) id[, (bool) sleeping, (bool) darkened]}
         */
        addUnit: function(x, y, unit){
            unit = _c.setDefaultParams(unit, {
                sleeping: false,
                darkened: false
            });

            _gr.map.units[x][y] = unit;
        },

        /**
         * move a unit according to a specific path. The function will not return until the animation is complete.
         * @param x
         * @param y
         * @param path [{x, y}, {x, y}, ...]
         */
        moveUnit: function(x, y, path){

        },

        /**
         * play an attack animation. The function will not return until the animation is complete.
         * @param attacker {x, y}
         * @param target {x, y}
         */
        attackUnit: function(attacker, target){

        },

        /**
         * show the defense animation for a specific unit. The function will not return until the animation is complete.
         * @param x
         * @param y
         */
        showDefenseAnim: function(x, y){

        },

        /**
         * show the assassin animation for a specific unit. The function will not return until the animation is complete.
         * @param x
         * @param y
         */
        showAssassinAnim: function(x, y){

        },

        /**
         * highlight a specific cell forever.
         * @param x
         * @param y
         * @param color1 the main color
         * @param color2 if specified, the highlight will alternate between color1 and color2
         */
        highlightCell: function(x, y, color1, color2){

        },

        /**
         * unhighlight a specific cell
         * @param x
         * @param y
         */
        unHighlightCell: function(x, y){

        },

        /**
         * unhighlight all cells
         */
        unHighlightAll: function(){

        },

        /**
         * set if a unit is sleeping or not
         * @param x
         * @param y
         * @param sleeping
         */
        setSleeping: function(x, y, sleeping){

        },

        /**
         * darken a specific unit
         * @param x
         * @param y
         */
        darkenUnit: function(x, y){

        },

        /**
         * undarken all units
         */
        undarkenAll: function(){

        }
    };

    _c.init($('.game-renderer .playground'));

    _c.render(function(e){
        _c.layers.clearLayer(_c.layers.units);
        _c.layers.clearBuffer();

        for(var x=0; x<_c.const.world.grid.w; ++x){
            for(var y=0; y<_c.const.world.grid.h; ++y){

            }
        }

        _c.layers.blitBuffer(_c.layers.units);
    });
});