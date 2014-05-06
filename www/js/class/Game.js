function Game(pMap, pPlayers) {
	this.players = pplayers || {0: "player1", 1: "player2"};
	this.map = pMap || defaultmap;
	this.UnitStorage = {};

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