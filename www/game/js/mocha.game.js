var tmpUnit = {
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

var expect = chai.expect;



describe('Verify the classes initialisation and structure', function() {
    
  it('Class game.js', function(done) {

    new Game();
    expect(g).to.be.an('Object');
    expect(g.idCount).to.be.a('Number');
    expect(g.players).to.be.an('Array');
    expect(g.map[0]).to.be.an('Array');
    expect(g.UnitStorage).to.be.an('Object');
    expect(g.turn).to.be.a('Number');
    done();

  });
    
  it('Class Unit.js', function(done) {

    new Game();
    var unit = new Unit(tmpUnit, 1, 1, 1);
    expect(unit.name).to.equal("Bowmen");
    expect(unit.desc).to.equal("An archer");
    expect(unit.longDesc).to.be.a('String');

    expect(unit.id).to.be.an('Number');

    expect(unit.player).to.equal(1);

    expect(unit.power).to.equal(1);
    expect(unit.range).to.equal(3);
    expect(unit.defense).to.equal(0);

    expect(unit.health).to.equal(10.0);

    expect(unit.fast).to.be.false;
    expect(unit.defender).to.be.false;
    expect(unit.assassin).to.be.false;

    expect(unit.moveType).to.equal('foot');
    expect(unit.moveValue).to.equal(3);

    expect(unit.x).to.equal(1);
    expect(unit.y).to.equal(1);

    expect(unit.guarding).to.be.false;

    expect(unit.moved).to.be.false;
    expect(unit.attacked).to.be.false;

    done();
  }); // it
}); // describe


describe('Testing routine of the game side of the application', function(done) {

  beforeEach(function(done){
    new Game();
    new Unit(tmpUnit, 0, 0, 0);
    new Unit(tmpUnit, 0, 2, 1);
    done();
  });



  it('Attack', function(done) {
    // Starting the attack routine


    expect(g.getUnitById(0,0).attack(g.getUnitById(1,1))).to.be.true;
    // We expect no error here.


    expect(g.getUnitById(0,0).attack(g.getUnitById(1,1)).message).to.be.a('String');
    // The unit already attacked this turn.


    expect(g.getUnitById(1,1).attack(g.getUnitById(0,0)).message).to.be.a('String');
    // This is not this unit's turn.


    g.cycleTurn();

    expect(g.turn).to.equal(1);
    // We verify the turn have cycled.


    expect(g.getUnitById(1,1).attack(g.getUnitById(0,0))).to.be.true;
    // We expect no error here.


    expect(g.getUnitById(1,1).attack(g.getUnitById(0,0)).message).to.be.a('String');
    // The unit already attacked this turn.


    g.cycleTurn();

    expect(g.turn).to.equal(0);
    // We verify the turn have cycled.


    expect(g.getUnitById(1,1).attack(g.getUnitById(0,0)).message).to.be.a('String');
    // This is not this unit's turn.


    expect(g.getUnitById(0,0).attack(g.getUnitById(1,1))).to.be.true;
    // We expect no error here.


    done();

  });



  it('Movement', function(done) {
    // Starting the movement routine


    expect(g.getUnitById(0,0).moveToCell(0,1)).to.be.true;
    // We expect no error here.


    expect(g.getUnitById(1,1).moveToCell(0,0).message).to.be.a('String');
    // This is not this unit's turn.


    g.cycleTurn();

    expect(g.turn).to.equal(1);
    // We verify the turn have cycled.


    expect(g.getUnitById(1,1).moveToCell(0,1).message).to.be.a('String');
    // There already is a unit in this cell.


    expect(g.getUnitById(1,1).moveToCell(0,0)).to.be.true;
    // We expect no error here.


    done();

  });
});