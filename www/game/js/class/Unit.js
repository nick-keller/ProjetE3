function Unit(param, x, y, player) {
	this.name = param.name;
	this.desc = param.desc;
	this.longDesc = param.longDesc;

	this.player = player;

	this.power = param.power;
	this.range = param.range;
	this.defense = param.defense;

	this.fast = param.fast;
	this.defender = param.defender;
	this.assassin = param.assassin;

	this.moveType = param.moveType;
	this.moveValue = param.moveValue;

	this.x = x;
	this.y = y;

	this.health = 10.0;
	this.guarding = false;

	// To execute at initialization
	g.map[this.x][this.y].unit = this;
	g.map[this.x][this.y].empty = false;
	// TODO: place the unit on the maps
	g.UnitStorage[this.player].push([this.x, this.y]);


	this.moved = false;
	this.attacked = false;

	return this;
}


Unit.prototype.guard = function() {
	if (this.attacked || this.moved)
		return new Error("This unit already has moved or attacked,"+
							" it can't guard");

	this.guarding = true;
	this.attacked = true;
	this.moved = true;
	return true;
};


Unit.prototype.moveToCell = function(px, py) {

	// TODO: take in account move factor and enemy units.
	// TODO: take in account the "fast" attribute

	if (this.player !== g.turn)
		return new Error("This is not this unit's turn");

	if (this.moved === true)
		return new Error("This unit already has moved");

	if (g.map[px][py].empty === false)
		return new Error("There is already an unit in the cell "+px+";"+py);

	if (Math.abs(this.x-px) + Math.abs(this.y-py) > this.moveValue)
		return new Error("Impossible to move this far");

	// Update the position in UnitStorage
	var index = g.UnitStorage[this.player].indexOf([this.x, this.y]);

	if (index <= -1)
		throw new Error("Unit to remove not found in the UnitStorage object");

	g.UnitStorage[this.player][index] = [x, y];


	var tmp = g.map[this.x][this.y].unit;

	g.map[this.x][this.y].unit = {empty:true};
	this.x = px;
	this.y = py;

	// TODO: move animation

	g.map[this.x][this.y].unit = tmp;
	g.map[this.x][this.y].empty = false;

	this.moved = true;

	return true;
}; // moveToCell



Unit.prototype.attack = function(unitB) {
	var unitA = this;

	if (unitA.player !== g.turn)
		return new Error("This is not this unit's turn");

	if (unitB.range > abs(unitB.x-unitA.x) + abs(unitB.y-unitA.y))
		return new Error("Insufficient range");

	if (unitB.player === unitA.player)
		return new Error("Attacking your own unit would be pretty stupid");

	unitA.attacked = true;
	// TODO: take in account the range for the riposte (?)
	if (unitB.defender || unitB.guarding) {
		// TODO: play guarding animation
		if (!unitA.assassinue) {
			if (unitB.dealDamage(unitA))
				unitA.dealDamage(unitB);
			return true;
		} else {
			// TODO: play assassinate animation
		}
	}
	
	if (unitA.dealDamage(unitB))
		unitB.dealDamage(unitA);

	return true;
}; // attack


Unit.prototype.dealDamage = function(targetedUnit) {

	var damage = (this.attack * this.health) /5;

	targetedUnit.health -= damage;

	// TODO: use the defense and terrain protection
	// TODO: attack animation

	if (targetedUnit.health <= 0.0) {
		targetedUnit.destroy();
		return false;
	}

	return true;
}; // dealDamage


Unit.prototype.destroy = function() {
	g.UnitStorage[this.player].indexOf(this);

	var index = g.UnitStorage[this.player].indexOf([this.x, this.y]);

	if (index <= -1)
		throw new Error("Unit to remove not found in the UnitStorage object");

    g.UnitStorage[this.player].splice(index, 1);

    delete g.map[this.x][this.y].unit;

    g.map[this.x][this.y].unit = {empty:true};


    // TODO: destroying animation

	return true;
}; // destroy