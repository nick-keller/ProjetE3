function Unit(param, x, y, player) {
	this.name = param.name;
	this.desc = param.desc;
	this.longDesc = param.longDesc;

	this.id = g.idCount++;

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
	g.map[this.x][this.y].unit = this;
	// TODO: place the unit on the maps
	g.UnitStorage[this.player][this.id] = {x:this.x, y:this.y};


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

	if (g.map[px][py].unit !== null)
		return new Error("There is already an unit in the cell "+px+";"+py);

	if (Math.abs(this.x-px) + Math.abs(this.y-py) > this.moveValue)
		return new Error("Impossible to move this far");


	var tmp = g.map[this.x][this.y].unit;

	g.map[this.x][this.y].unit = null;
	this.x = px;
	this.y = py;

	// Update the position in UnitStorage
	g.UnitStorage[this.player][this.id] = {x:px, y:py};

	// TODO: move animation

	g.map[this.x][this.y].unit = tmp;

	this.moved = true;

	return true;
}; // moveToCell



Unit.prototype.attack = function(unitB) {
	console.log("Unit "+this.id+" attacks unit "+unitB.id); /*Debug marker*/
	var unitA = this;

	if (unitA.player !== g.turn)
		return new Error("This is not this unit's turn");

	if (unitA.attacked === true)
		return new Error("This unit already attacked");

	if (unitB.range <= Math.abs(unitB.x-unitA.x) + Math.abs(unitB.y-unitA.y))
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

	var damage = (this.power * this.health) /5;

	// Round at the 2nd decimal
	damage = Math.round(damage * 100) / 100;


	targetedUnit.health -= damage;

	// Round at the 2nd decimal
	targetedUnit.health = Math.round(targetedUnit.health * 100) / 100;
	
	console.log("Unit "+this.id+" deals "+damage+" to unit "+targetedUnit.id+
				", has "+targetedUnit.health+"hp left" );


	// TODO: use the defense and terrain protection
	// TODO: attack animation

	if (targetedUnit.health <= 0.0) {
		targetedUnit.destroy();
		return false;
	}

	return true;
}; // dealDamage


Unit.prototype.destroy = function() {
	console.log("Unit "+this.id+" is destroyed"); /*Debug marker*/

    delete g.UnitStorage[this.player][this.id];

    delete g.map[this.x][this.y].unit;

    g.map[this.x][this.y].unit = null;

    // TODO: destroying animation

	return true;
}; // destroy