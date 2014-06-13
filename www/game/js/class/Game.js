function Game(pMap, pPlayers) {

	window._g = this;

	this.clickState = {state: null};

	this.idCount = 1;

	this.players = pPlayers || [0, 1];

	var defaultTerrain = {
		name: "plain",
		protection: 1,
		moveFactor: {
			"foot": 1,
			"wheel": 1,
			"chain": 1,
			"horse": 1,
			"boat": 999,
			"plane": 1
		},
		sprite: null
	};

	var defaultMap = [	[{unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}],
						[{unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}],
						[{unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}],
						[{unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}, {unit:null, terrain:defaultTerrain}]
		];

	// x are up/down, and y are left/right


	this.map = pMap || defaultMap;
	this.unitStorage = { 0:{}, 1:{} };

	//for (var i = this.players.length - 1; i >= 0; i--) {
	//	this.unitStorage.player[i] = {};
	//}

	this.turn = 0;


	
}

Game.prototype.onClick = function(x, y) {
	var cl = JSON.parse(JSON.stringify(clickState));
	switch(cl.state) {

		case null:
			if (_g.map[y][x].unit !== null) {
				var unit = _g.map[y][x].unit;
				_g.clickState.x = x;
				_g.clickState.y = y;

				if ((unit.player !== _g.turn) /*&& (unit.player !== _g.player)*/) {
					_g.clickState.state = "ownUnit";
					_g.clickState.unit = unit;
					_g.clickState.moveableCells = unit.getMoveableCells();
					// TODO: _g.clickState.attCells = unit.getAttCells();
					// TODO: color the cells
					// TODO: menu
				}
			}
			return;

		case "ownUnit":
			var moveable = false;
			for (var i in cl.moveableCells) 
				if (cl.x === x && cl.y === y)
					moveable = true;

			var attackable = false;
			for (var i in cl.attCells) 
				if (cl.x === x && cl.y === y)
					attackable = true;

			if (attackable === true) {
				unit.attack(_g.map[y][x].unit);
				// TODO: uncolor cells
				_g.clickState = {state: null};
				return;
			}

			if (moveable === true) {
				unit.moveToCell(y, x, cl.moveableCells);
				// TODO: uncolor cells
				_g.clickState = {state: null};
				return;
			}

			// TODO: uncolor cells
			_g.clickState = {state: null};
			return;

		default:


	};
};

Game.prototype.cycleTurn = function() {

	for (var i in _g.unitStorage[this.turn]) {
		var tmpUnit = this.map[_g.unitStorage[this.turn][i].x]
							[this.unitStorage[this.turn][i].y].unit;


		tmpUnit.guarding = false;
		tmpUnit.attacked = false;
		tmpUnit.moved = false;
	}


	this.turn = (this.turn+1)%(this.players.length);

	return true;
};


Game.prototype.getUnitById = function(player, id) {
	var obj = _g.unitStorage[player][id];
	return _g.map[obj.x][obj.y].unit;
};