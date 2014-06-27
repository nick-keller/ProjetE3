$(function(){
	var map = _gr.map.ground;
	var unitspre = [];

	for (var i = map.length - 1; i >= 0; i--) {
		for (var j = map[i].length - 1; j >= 0; j--) {
			if (level.units[i][j] !== null) {
				var unit = units.filter(function(e){
					return e.id == level.units[i][j].id;
				});

				unit = $.extend(true, {}, unit[0]);
				unit.x = i;
				unit.y = j;
				unit.player = level.units[i][j].player;

				unitspre.push(unit);

			}

			var terrain = grounds[map[i][j]];
			map[i][j] = {
				terrain: terrain,
				unit: null
			};
		}
	}





	new Game(map, unitspre);
	_c.mousedown(_g.onClick);
});