$(function(){
	var map = _gr.map.ground;

	for (var i = map.length - 1; i >= 0; i--) {
		for (var j = map[i].length - 1; j >= 0; j--) {
			var terrain = grounds[map[i][j]];
			map[i][j] = {
				terrain: terrain,
				unit: null
			};
		}
	}


	new Game(map);
	_c.mousedown(_g.onClick);
});