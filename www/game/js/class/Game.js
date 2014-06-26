function Game(pMap, pPlayers, pUnits) {

	window._g = this;

	this.clickState = {
		state: null
	};

	this.idCount = 1;

	this.players = pPlayers || [0, 1];

	this.t = {
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

	this.defaultUnit = {
		"name": "Bowmen",
		"desc": "An archer",
		"longDesc": "A troop of archers armed with bows. This is the basic ranged unit.",
		"power": 1,
		"range": 3,
		"defense": 0,
		"fast": false,
		"defender": false,
		"assassin": false,
		"moveType": "foot",
		"moveValue": 3
	};

	this.unitStorage = {0: {}, 1: {}};

	this.turn = 0;


	// x are up/down, and y are left/right
	this.defaultMap = [
		[{unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}],
		[{unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}],
		[{unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}],
		[{unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}, {unit: null, terrain: _g.t}]
	];


    this.defaultUnits = [];
    this.defaultUnits.push($.extend(true, {}, this.defaultUnit));
    this.defaultUnits.push($.extend(true, {}, this.defaultUnit));
    this.defaultUnits[0].x = 0;
    this.defaultUnits[0].y = 0;
    this.defaultUnits[0].player = 0;
    this.defaultUnits[1].x = 0;
    this.defaultUnits[1].y = 2;
	this.defaultUnits[1].player = 1;


    this.map = pMap || this.defaultMap;
	this.units = pUnits || this.defaultUnits;

	this.size = Math.pow(10, Math.max(
		this.map.length.toString().length,
		this.map[0].length.toString().length
	) + 1);


    for (var i = this.units.length - 1; i >= 0; i--) {
        new Unit(this.units[i], this.units[i].x, this.units[i].y, this.units[i].player);
    }


	_gr.showMenu({name:"Player "+(this.turn-1), disabled: true, callback:function(){}},
		{name:"End turn", disabled: false, callback:_g.cycleTurn});


	delete this.unit;
	delete this.defaultMap;
	delete this.defaultUnits;
	delete this.defaultUnit;
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
	_gr.showMenu({name:"End turn", disabled: true, callback:function(){}});
	_gr.undarkenAll();

	for (var i in _g.unitStorage[this.turn]) {
		var tmpUnit = this.map[_g.unitStorage[this.turn][i].x]
					[this.unitStorage[this.turn][i].y].unit;


		tmpUnit.guarding = false;
		tmpUnit.attacked = false;
		tmpUnit.moved = false;
		_gr.darkenUnit(tmpUnit.y, tmpUnit.x);
	}



	this.turn = (this.turn + 1) % (this.players.length);

	_gr.showMenu({name:"Player "+(this.turn-1), disabled: true, callback:function(){}},
		{name:"End turn", disabled: false, callback:_g.cycleTurn});

	return true;
};