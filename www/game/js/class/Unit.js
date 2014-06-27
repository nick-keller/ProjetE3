/**
 * Constructor of the unit
 * @param {Object} param; an object with all the attributes of the unit
 * @param {Number} x;
 * @param {Number} y;
 * @param {number} player;
 * @return {Object}; this
 */
function Unit(param, x, y, player) {
    console.log(param);
	this.name = param.name;
	this.desc = param.desc;
	this.longDesc = param.longDesc;

	this.id = _g.idCount++;
	this.unitTypeId = param.id;

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


	// To execute at initialization
	_g.map[this.x][this.y].unit = this;

	_gr.addUnit(this.x, this.y, {id:this.unitTypeId, color:player === 0?'red':'blue'});
	_g.unitStorage[this.player][this.id] = {
		x: this.x,
		y: this.y
	};


	this.moved = false;
	this.attacked = false;
	this.guarding = false;
	this.resting = false;

	return this;
}

/**
 * Put the unit into guard state
 * @this {Object}; The unit
 * @return {Bool/Error}; Returns false if sucessfull, else error
 */
Unit.prototype.guard = function() {
	if (this.attacked || this.moved)
		return new Error("This unit already has moved or attacked," +
			" it can't guard");

	this.guarding = true;
	this.attacked = true;
	this.moved = true;

	_gr.darkenUnit(this.x, this.y);
	return false;
};


/**
 * Put the unit into rest state
 * @this {Object}; The unit
 * @return {Bool/Error}; Returns false if sucessfull, else error
 */
Unit.prototype.rest = function() {
	if (this.attacked || this.moved)
		return new Error("This unit already has moved or attacked," +
			" it can't rest");

	this.resting = true;
	this.attacked = true;
	this.moved = true;

	_gr.darkenUnit(this.x, this.y);
	return false;
};



/**
 * Finds the units where a unit can travel
 * @this {Object}; The unit
 * @return {Object}; The cells where the unit can move, with the cost
 */
Unit.prototype.getMoveableCells = function() {
	var unit = this;
	var maxX = _g.map.length;
	var maxY = _g.map[0].length;

	var size = _g.size;
	var cells = {};


	(function loop(x, y, remaining) {
		if (x >= maxX || y >= maxY || x < 0 || y < 0)
			return;

		if (remaining < 0)
			return;

		if (_g.map[x][y].unit !== null)
			if (_g.map[x][y].unit.player !== _g.turn)
				return;

		if (cells[x * size + y] >= remaining)
			return;

		cells[x * size + y] = remaining;
		if (_g.map[x][y+1] !== undefined)
			loop(x, y + 1, remaining - _g.map[x][y+1].terrain.moveFactor[unit.moveType]);
		
		if (_g.map[x][y-1] !== undefined)
			loop(x, y - 1, remaining - _g.map[x][y-1].terrain.moveFactor[unit.moveType]);

		if (_g.map[x+1] !== undefined)
			loop(x + 1, y, remaining - _g.map[x+1][y].terrain.moveFactor[unit.moveType]);

		if (_g.map[x-1] !== undefined)
			loop(x - 1, y, remaining - _g.map[x-1][y].terrain.moveFactor[unit.moveType]);


	})(unit.x, unit.y, unit.moveValue);

	return cells;
};



/**
 * Moves an unit
 * @this {Object}; The unit
 * @param {Number} px; Where to move
 * @param {Number} py; Where to move
 * @param {Object} mc; Moveable cells
 * @return {Bool/Error}; Returns false if sucessfull, else error
 */
Unit.prototype.moveToCell = function(px, py, mc) {

	if (this.player !== _g.turn) {
		_g.clickState = {state: null};
		throw new Error("This is not this unit's turn");
	}

	if (this.moved === true) {
		_g.clickState = {state: null};
		throw new Error("This unit already has moved");
	}

	if (_g.map[px][py].unit !== null) {
		_g.clickState = {state: null};
		throw new Error("There is already an unit in the cell " + px + ";" + py);
	}

//	if (Math.abs(this.x - px) + Math.abs(this.y - py) > this.moveValue) {
//		_g.clickState = {state: null};
//		throw new Error("Impossible to move this far");
//	}

	var path = [];

	var tx = px;
	var ty = py;
	var remaining = mc[tx * _g.size + ty];


	while (tx !== this.x || ty !== this.y) {


		path.unshift({
			x: tx,
			y: ty
		});


		var cost = _g.map[tx][ty].terrain.moveFactor[this.moveType];

		if (mc[tx * _g.size + ty - 1] - cost === remaining) {
			ty--;
			remaining += cost;
			continue;
		}

		if (mc[tx * _g.size + ty + 1] - cost === remaining) {
			ty++;
			remaining += cost;
			continue;
		}

		if (mc[tx * _g.size + ty - 1 * _g.size] - cost === remaining) {
			tx--;
			remaining += cost;
			continue;
		}

		if (mc[tx * _g.size + ty + 1 * _g.size] - cost === remaining) {
			tx++;
			remaining += cost;
			continue;
		}

		throw new Error("Erreur dans le pathfinding");
	}

	_gr.moveUnit(this.x, this.y, path, function(){
		if (this.attacked === true)
			_gr.darkenUnit(px, py);
	});

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


	return false;
}; // moveToCell



/**
 * Finds the units where a unit can attack
 * @this {Object}; The unit
 * @return {Object}; The cells where the unit can attack, with the cost
 */
Unit.prototype.getAttCells = function() {
	var unit = this;
	var maxX = _g.map.length;
	var maxY = _g.map[0].length;

	var size = _g.size;
	var cells = {};


	(function loop(x, y, remaining) {
		if (x >= maxX || y >= maxY || x < 0 || y < 0)
			return;

		if (remaining < 0)
			return;

		if (cells[x * size + y] >= remaining)
			return;

		cells[x * size + y] = remaining;

		if (_g.map[x][y+1] !== undefined)
			loop(x, y + 1, remaining - 1);

		if (_g.map[x][y-1] !== undefined)
			loop(x, y - 1, remaining - 1);

		if (_g.map[x+1] !== undefined)
			loop(x + 1, y, remaining - 1);

		if (_g.map[x-1] !== undefined)
			loop(x - 1, y, remaining - 1);

	})(unit.x, unit.y, unit.range);

	return cells;
};




/**
 * Makes an unit attack another one
 * @this {Object} unitA; The unit attacking
 * @param {Object} unitB; The unit attacked
 * @return {Bool/Error}; Returns false if sucessfull, else error
 */
Unit.prototype.attack = function(unitB) {
	var unitA = this;

	if (unitA.player !== _g.turn) {
		_g.clickState = {state: null};
		throw new Error("This is not this unit's turn");
	}

	if (unitA.attacked === true) {
		_g.clickState = {state: null};
		throw new Error("This unit already attacked");
	}

	var dist = Math.abs(unitB.x - unitA.x) + Math.abs(unitB.y - unitA.y);

	var hitBack = (unitB.range >= dist) && !unitB.resting;

	if (unitA.range < dist) {
		_g.clickState = {state: null};
		throw new Error("Insufficient range");
	}

	if (unitB.player === unitA.player) {
		_g.clickState = {state: null};
		throw new Error("Attacking your own unit would be pretty stupid");
	}

	unitA.attacked = true;

	if (hitBack === false) {
		unitA.dealDamage(unitB);

		if (unitA.fast === true)
			unitA.moved = false;

		if (unitA.moved === true)
			_gr.darkenUnit(unitA.x, unitA.y);

		return false;
	}

	if (unitB.defender || unitB.guarding) {
		_gr.showDefenseAnim(unitB.x, unitB.y);

		if (unitA.assassin === false) {
			if (unitB.dealDamage(unitA) === false)
				unitA.dealDamage(unitB);
		} else {
			_gr.showAssassinAnim(unitA.x, unitA.y);
			if (unitA.dealDamage(unitB) === false)
				unitB.dealDamage(unitA);
		}
	} else {
		if (unitA.dealDamage(unitB) === false)
			unitB.dealDamage(unitA);
	}

	if (unitA.fast === true)
		unitA.moved = false;

	if (unitA.moved === true)
		_gr.darkenUnit(unitA.x, unitA.y);

	return false;
}; // attack

/**
 * Makes an unit hit another one
 * @this {Object}; The unit attacking
 * @param {Object} target; The unit attacked
 * @return {Bool/Error}; Returns false if sucessfull, 
 * 						true if the unit is killed, else error
 */
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
		x: attacker.x,
		y: attacker.y
	}, {
		x: target.x,
		y: target.y
	});

	_gr.setHP(target.x, target.y, Math.ceil(target.health));

	if (target.health <= 0.0) {
		target.destroy();
		return true;
	}

	return false;
}; // dealDamage

/**
 * Kills an unit
 * @this {Object}; The unit attacking
 * @return {Bool/Error}; Returns false if sucessfull, else error
 */
Unit.prototype.destroy = function() {

	_gr.killUnit(this.x, this.y);

	delete _g.unitStorage[this.player][this.id];

	delete _g.map[this.x][this.y].unit;

	_g.map[this.x][this.y].unit = null;

	return false;
}; // destroy