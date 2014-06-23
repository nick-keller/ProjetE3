function Unit(param, x, y, player) {
	this.name = param.name;
	this.desc = param.desc;
	this.longDesc = param.longDesc;

	this.id = _g.idCount++;

	this.player = player;

	this.power = param.power;
	this.range = param.range;
	this.defense = param.defense;

	this.health = 10.0;

	this.fast = param.fast;
	this.defender = param.defender;
	this.assassin = param.assassin;

	this.moveType = param.moveType;
	this.moveValue = param.moveValue;

	this.x = x;
	this.y = y;

	this.guarding = false;

	// To execute at initialization
	_g.map[this.x][this.y].unit = this;

	// TODO: _gr.addUnit(this.id);
	_g.unitStorage[this.player][this.id] = {
		x: this.x,
		y: this.y
	};


	this.moved = false;
	this.attacked = false;

	return this;
}


Unit.prototype.guard = function() {
	if (this.attacked || this.moved)
		return new Error("This unit already has moved or attacked," +
			" it can't guard");

	this.guarding = true;
	this.attacked = true;
	this.moved = true;

	_gr.darkenUnit(this.y, this.x);
	return false;
};


Unit.prototype.getMoveableCells = function() {
	var unit = this;
	var maxX = _g.map.length;
	var maxY = _g.map[0].length;

	var size = _g.size;
	var cells = {};


	(function loop(x, y, remaining) {
		if (x >= maxX || y >= maxY || x < 0 || y < 0)
			return;

		var tmpRemain = remaining - _g.map[x][y].terrain.moveFactor[unit.moveType];

		if (_g.map[x][y].unit !== null)
			if (_g.map[x][y].unit.player !== _g.turn)
				return;

		if (tmpRemain < 0)
			return;

		if (cells[x * size + y] >= tmpRemain)
			return;

		cells[x * size + y] = tmpRemain;

		loop(x, y + 1, tmpRemain);
		loop(x, y - 1, tmpRemain);
		loop(x + 1, y, tmpRemain);
		loop(x - 1, y, tmpRemain);

	})(unit.x, unit.y, unit.moveValue);

	cells.fact = size;

	return cells;
};



Unit.prototype.getAttCells = function() {
	var unit = this;
	var maxX = _g.map.length;
	var maxY = _g.map[0].length;

	var size = _g.size;
	var cells = {};


	(function loop(x, y, remaining) {
		if (x >= maxX || y >= maxY || x < 0 || y < 0)
			return;

		var tmpRemain = remaining - 1;

		if (tmpRemain < 0)
			return;

		if (cells[x * size + y] >= tmpRemain)
			return;

		cells[x * size + y] = tmpRemain;

		loop(x, y + 1, tmpRemain);
		loop(x, y - 1, tmpRemain);
		loop(x + 1, y, tmpRemain);
		loop(x - 1, y, tmpRemain);

	})(unit.x, unit.y, unit.range);

	cells.fact = size;

	return cells;
};


Unit.prototype.moveToCell = function(px, py, mc) {

	if (this.player !== _g.turn)
		return new Error("This is not this unit's turn");

	if (this.moved === true)
		return new Error("This unit already has moved");

	if (_g.map[px][py].unit !== null)
		return new Error("There is already an unit in the cell " + px + ";" + py);

	if (Math.abs(this.x - px) + Math.abs(this.y - py) > this.moveValue)
		return new Error("Impossible to move this far");

	var path = [];

	var x = px;
	var y = py;
	var remaining = mc[x * mc.fact + y];

	while (x !== this.x && y !== this.y) {
		path.unshift({
			x: y,
			y: x
		});

		var cost = _g.map[x][y].terrain.moveFactor[this.moveType];

		if (mc[x * mc.fact + y - 1] + cost === remaining) {
			y--;
			continue;
		}

		if (mc[x * mc.fact + y + 1] + cost === remaining) {
			y++;
			continue;
		}

		if (mc[x * mc.fact + y - 1 * mc.fact] + cost === remaining) {
			x--;
			continue;
		}

		if (mc[x * mc.fact + y + 1 * mc.fact] + cost === remaining) {
			x++;
			continue;
		}
	}

	_gr.moveUnit(this.y, this.x, path);

	var tmp = _g.map[this.x][this.y].unit;

	_g.map[this.x][this.y].unit = null;
	this.x = px;
	this.y = py;

	// Update the position in unitStorage
	_g.unitStorage[this.player][this.id] = {
		x: px,
		y: py
	};

	_g.map[this.x][this.y].unit = tmp;

	this.moved = true;

	if (this.attacked === true)
		_gr.darkenUnit(this.y, this.x);

	return false;
}; // moveToCell



Unit.prototype.attack = function(unitB) {
	var unitA = this;

	if (unitA.player !== _g.turn)
		return new Error("This is not this unit's turn");

	if (unitA.attacked === true)
		return new Error("This unit already attacked");

	var dist = Math.abs(unitB.x - unitA.x) + Math.abs(unitB.y - unitA.y);

	var hitBack = (unitB.range <= dist) && !unitB.sleeping;

	if (unitA.range <= dist)
		return new Error("Insufficient range");

	if (unitB.player === unitA.player)
		return new Error("Attacking your own unit would be pretty stupid");

	unitA.attacked = true;

	if (hitBack === false) {
		unitA.dealDamage(unitB);
		return false;
	}

	if (unitB.defender || unitB.guarding) {
		_gr.showDefenseAnim(unitB.y, unitB.x);

		if (unitA.assassin === false) {
			if (unitB.dealDamage(unitA) === false)
				unitA.dealDamage(unitB);
		} else {
			_gr.showAssassinAnim(unitA.y, unitA.x);
			if (unitA.dealDamage(unitB) === false)
				unitB.dealDamage(unitA);
		}
	} else {
		if (unitA.dealDamage(unitB) === false)
			unitB.dealDamage(unitA);
	}

	if (unitA.fast === true)
		unitA.moved = false;
	else
		_gr.darkenUnit(unitA.y, unitA.x);

	return false;
}; // attack


Unit.prototype.dealDamage = function(target) {

	var attacker = this;

	var defensive = Math.log(
		target.defense + _g.map[attacker.x][attacker.y].terrain.defense);
	if (!defensive || defensive < 1)
		defensive = 1;

	var damage = (this.power * this.health * 0.2) / (defensive);

	// Round at the 2nd decimal
	damage = Math.round(damage * 100) / 100;


	target.health -= damage;

	// Round at the 2nd decimal
	target.health = Math.round(target.health * 100) / 100;


	_gr.attackUnit({
		x: attacker.y,
		y: attacker.x
	}, {
		x: target.y,
		y: target.x
	});

	if (target.health <= 0.0) {
		target.destroy();
		return true;
	}

	return false;
}; // dealDamage


Unit.prototype.destroy = function() {

	_gr.killUnit({
		x: this.y,
		y: this.x
	});

	delete _g.unitStorage[this.player][this.id];

	delete _g.map[this.x][this.y].unit;

	_g.map[this.x][this.y].unit = null;

	return false;
}; // destroy