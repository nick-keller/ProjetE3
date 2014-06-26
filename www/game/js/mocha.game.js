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

// Placeholder for _gr to satisfy mocha
window._gr = {
  addUnit: function(){},
  moveUnit: function(){},
  killUnit: function(){},
  attackUnit: function(){},
  showDefenseAnim: function(){},
  showAssassinAnim: function(){},
  highlightCell: function(){},
  unHighlightCell: function(){},
  unHighlightAll: function(){},
  setSleeping: function(){},
  setHP: function(){},
  darkenUnit: function(){},
  undarkenAll: function(){},
  showMenu: function(){}
};



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
    var unit = _g.map[0][0].unit;
    
    expect(unit.name).to.equal("Bowmen");
    expect(unit.desc).to.equal("An archer");
    expect(unit.longDesc).to.be.a('String');

    expect(unit.id).to.be.an('Number');

    expect(unit.player).to.equal(0);

    expect(unit.power).to.equal(1);
    expect(unit.range).to.equal(3);
    expect(unit.defense).to.equal(0);
    expect(unit.health).to.equal(10.0);

    expect(unit.fast).to.be.false;
    expect(unit.defender).to.be.false;
    expect(unit.assassin).to.be.false;

    expect(unit.moveType).to.equal('foot');
    expect(unit.moveValue).to.equal(3);


    expect(unit.x).to.equal(0);
    expect(unit.y).to.equal(0);

    expect(unit.guarding).to.be.false;

    expect(unit.moved).to.be.false;
    expect(unit.attacked).to.be.false;

    done();
  }); // it
}); // describe


describe('Testing routine of the game side of the application', function(done) {

  beforeEach(function(done){
    new Game();
    done();
  });



  it('Attack', function(done) {
    // Starting the attack routine


    var cells = _g.map[0][0].unit.getAttCells();

    expect(cells).to.be.an('Object');

    expect(cells[0]).to.be.a('Number');

    expect(cells[200]).to.be.a('Number');
    console.log('Attackable cells when unit is at (0,0)',cells);
    // We expect the right format


    expect(_g.map[0][0].unit.attack(_g.map[0][2].unit)).to.be.false;
    // We expect no error here.


    expect(_g.map[0][0].unit.attack(_g.map[0][2].unit).message).to.be.a('String');
    // The unit already attacked this turn.


    expect(_g.map[0][2].unit.attack(_g.map[0][0].unit).message).to.be.a('String');
    // This is not this unit's turn.


    _g.cycleTurn();

    expect(_g.turn).to.equal(1);
    // We verify the turn have cycled.


    expect(_g.map[0][2].unit.attack(_g.map[0][0].unit)).to.be.false;
    // We expect no error here.


    expect(_g.map[0][2].unit.attack(_g.map[0][0].unit).message).to.be.a('String');
    // The unit already attacked this turn.


    _g.cycleTurn();

    expect(_g.turn).to.equal(0);
    // We verify the turn have cycled.


    expect(_g.map[0][2].unit.attack(_g.map[0][0].unit).message).to.be.a('String');
    // This is not this unit's turn.


    expect(_g.map[0][0].unit.attack(_g.map[0][2].unit)).to.be.false;
    // We expect no error here.


    done();

  });



  it('Movement', function(done) {
    // Starting the movement routine

    var cells = _g.map[0][0].unit.getMoveableCells();

    expect(cells).to.be.an('Object');

    expect(cells[0]).to.be.a('Number');

    expect(cells[200]).to.be.a('Number');
    console.log('Moveable cells when unit is at (0,0)',cells);
    // We expect the right format


    expect(_g.map[0][0].unit.moveToCell(0,1,cells)).to.be.false;
    // We expect no error here.


    expect(_g.map[0][2].unit.moveToCell(0,0,_g.map[0][2].unit.getMoveableCells()).message).to.be.a('String');
    // This is not this unit's turn.


    _g.cycleTurn();

    expect(_g.turn).to.equal(1);
    // We verify the turn have cycled.


    expect(_g.map[0][2].unit.moveToCell(0,1,_g.map[0][2].unit.getMoveableCells()).message).to.be.a('String');
    // There already is a unit in this cell.


    expect(_g.map[0][2].unit.moveToCell(0,0,_g.map[0][2].unit.getMoveableCells())).to.be.false;
    // We expect no error here.


    done();

  });
});