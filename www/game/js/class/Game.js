function Game(pMap, pPlayers) {

	window.g = this;

	this.idCount = 0;

	this.players = pPlayers || [0, 1];


	var defaultMap = [	[{unit:null}, {unit:null}, {unit:null}, {unit:null}],
						[{unit:null}, {unit:null}, {unit:null}, {unit:null}],
						[{unit:null}, {unit:null}, {unit:null}, {unit:null}],
						[{unit:null}, {unit:null}, {unit:null}, {unit:null}]
		];

	// x are up/down, and y are left/right


	this.map = pMap || defaultMap;
	this.UnitStorage = { 0:{}, 1:{} };

	// for (var i = this.players.length - 1; i >= 0; i--) {
	// 	this.UnitStorage.player[i] = {};
	// }

	this.turn = 0;


	
}

Game.prototype.cycleTurn = function() {

	for (var i in g.UnitStorage[this.turn]) {
		var tmpUnit = this.map[g.UnitStorage[this.turn][i].x]
							[this.UnitStorage[this.turn][i].y].unit;


		tmpUnit.guarding = false;
		tmpUnit.attacked = false;
		tmpUnit.moved = false;
	}


	this.turn = (this.turn+1)%(this.players.length);

	return true;
};


Game.prototype.getUnitById = function(id, player) {
	var obj = this.UnitStorage[player][id];
	return this.map[obj.x][obj.y].unit;
};