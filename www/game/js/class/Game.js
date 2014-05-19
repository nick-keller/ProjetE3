function Game(pMap, pPlayers) {

	window.g = this;

	this.players = pPlayers || ["player1", "player2"];

	

	var defaultMap = [	[{empty:true}, {empty:true}, {empty:true}, {empty:true}],
						[{empty:true}, {empty:true}, {empty:true}, {empty:true}],
						[{empty:true}, {empty:true}, {empty:true}, {empty:true}],
						[{empty:true}, {empty:true}, {empty:true}, {empty:true}]
		];


	this.map = pMap || defaultMap;
	this.UnitStorage = [];

	for (var i = this.players.length - 1; i >= 0; i--) {
		this.UnitStorage.push([]);
	}


	this.turn = 0;


	this.cycleTurn = function() {
		for (var i = Unit.prototype.UnitStorage[this.turn].length - 1; i >= 0; i--) {
			var tmpUnit = g.map[g.UnitStorage[this.turn][i][0]] [g.UnitStorage[this.turn][i][1]];
			tmpUnit.guarding = false;
			tmpUnit.attacked = false;
			tmpUnit.moved = false;
		}

		this.turn = (this.turn+1)%(this.players.length);

		return true;
	};
}