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
    expect(_g).to.be.an('Object');
    expect(_g.idCount).to.be.a('Number');
    expect(_g.players).to.be.an('Array');
    expect(_g.map[0]).to.be.an('Array');
    expect(_g.unitStorage).to.be.an('Object');
    expect(_g.turn).to.be.a('Number');
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


    expect(_g.getUnitById(0,1).attack(_g.getUnitById(1,2))).to.be.false;
    // We expect no error here.


    expect(_g.getUnitById(0,1).attack(_g.getUnitById(1,2)).message).to.be.a('String');
    // The unit already attacked this turn.


    expect(_g.getUnitById(1,2).attack(_g.getUnitById(0,1)).message).to.be.a('String');
    // This is not this unit's turn.


    _g.cycleTurn();

    expect(_g.turn).to.equal(1);
    // We verify the turn have cycled.


    expect(_g.getUnitById(1,2).attack(_g.getUnitById(0,1))).to.be.false;
    // We expect no error here.


    expect(_g.getUnitById(1,2).attack(_g.getUnitById(0,1)).message).to.be.a('String');
    // The unit already attacked this turn.


    _g.cycleTurn();

    expect(_g.turn).to.equal(0);
    // We verify the turn have cycled.


    expect(_g.getUnitById(1,2).attack(_g.getUnitById(0,1)).message).to.be.a('String');
    // This is not this unit's turn.


    expect(_g.getUnitById(0,1).attack(_g.getUnitById(1,2))).to.be.false;
    // We expect no error here.


    done();

  });



  it('Movement', function(done) {
    // Starting the movement routine


    expect(_g.getUnitById(0,1).moveToCell(0,1)).to.be.false;
    // We expect no error here.


    expect(_g.getUnitById(1,2).moveToCell(0,0).message).to.be.a('String');
    // This is not this unit's turn.


    _g.cycleTurn();

    expect(_g.turn).to.equal(1);
    // We verify the turn have cycled.


    expect(_g.getUnitById(1,2).moveToCell(0,1).message).to.be.a('String');
    // There already is a unit in this cell.


    expect(_g.getUnitById(1,2).moveToCell(0,0)).to.be.false;
    // We expect no error here.


    // var cells = _g.getUnitById(0,1).getMoveableCells();

    // expect(cells).to.be.an('Array');

    // expect(cells.length).to.be.equal(8);

    // expect(cells[0]).to.be.an('Object');

    // expect(cells[0].x).to.be.a('Number');
    // // Should be an array of 8 objects

    done();

  });
});