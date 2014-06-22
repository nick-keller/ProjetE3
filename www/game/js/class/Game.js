function Game(pMap, pPlayers) {

	window._g = this;

	this.clickState = {
		state: null
	};

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

	this.size = Math.pow(10, Math.max(
		maxX.toString().length,
		maxY.toString().length
	) + 1);

	var defaultMap = [
		[{
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}],
		[{
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}],
		[{
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}],
		[{
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}, {
			unit: null,
			terrain: defaultTerrain
		}]
	];

	// x are up/down, and y are left/right


	this.map = pMap || defaultMap;
	this.unitStorage = {
		0: {},
		1: {}
	};

	this.turn = 0;



}

Game.prototype.onClick = function(y, x) {
	var cl = JSON.parse(JSON.stringify(clickState));
	switch (cl.state) {

		case null:
			if (_g.map[x][y].unit !== null) {
				var unit = _g.map[x][y].unit;
				_g.clickState.x = x;
				_g.clickState.y = y;

				if (unit.player === _g.turn) {
					_g.clickState.state = "ownUnit";
					_g.clickState.unit = unit;
					_g.clickState.moveableCells = unit.getMoveableCells();
					_g.clickState.attCells = unit.getAttCells();
					// TODO: menu
					for (var i in _g.clickState.moveableCells) {
						if (_g.clickState.attCells[i] !== undefined) {
							highlightCell(i % size, Math.floor(i / size), blue, red);
						} else {
							highlightCell(i % size, Math.floor(i / size), blue, null);
						}
					}

					for (var i in _g.clickState.attCells) {
						highlightCell(i % size, Math.floor(i / size), blue, red);
					}


				}
			}
			return;

		case "ownUnit":

			if (cl.moveableCells[x * _g.size + y] !== undefined) {
				_gr.unHighlightAll();
				cl.unit.moveToCell(y, x, cl.moveableCells);
				_g.clickState = {
					state: null
				};
				return;
			}

			if (cl.attCells[x * _g.size + y] !== undefined &&
				_g.map[x][y].unit !== null &&
				_g.map[x][y].unit.player !== _g.turn) {
				_gr.unHighlightAll();
				cl.unit.attack(_g.map[x][y].unit);
				_g.clickState = {
					state: null
				};
				return;
			}


			_gr.unHighlightAll();
			_g.clickState = {
				state: null
			};
			return;

		default:


	}
};

Game.prototype.cycleTurn = function() {

	for (var i in _g.unitStorage[this.turn]) {
		var tmpUnit = this.map[_g.unitStorage[this.turn][i].x]
		[this.unitStorage[this.turn][i].y].unit;


		tmpUnit.guarding = false;
		tmpUnit.attacked = false;
		tmpUnit.moved = false;
	}

	_gr.undarkenAll();


	this.turn = (this.turn + 1) % (this.players.length);

	return true;
};


Game.prototype.getUnitById = function(player, id) {
	var obj = _g.unitStorage[player][id];
	return _g.map[obj.x][obj.y].unit;
};