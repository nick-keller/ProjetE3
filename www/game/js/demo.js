// J'utilise : tab, grounds et units

// Peut être intervertir h et w, a tester.
var pMap = new Array(_c.const.world.grid.h);
for (var i = pMap.length - 1; i >= 0; i--) {
	pMap[i] = new Array(_c.const.world.grid.w);
}

for (var x = pMap.length - 1; i >= 0; i--) {
	for (var y = pMap[x].length - 1; i >= 0; i--) {
		pMap[x][y] = {
			unit: null,
			// ici, tab represente le tableau avec les id tes tiles de toutes les case
			terrain: grounds[tab[y][x]]
		};
	}
}

var preDeployedUnits = [];
preDeployedUnits.push($.extend(true, {}, units[0]));
preDeployedUnits.push($.extend(true, {}, units[0]));
preDeployedUnits[0].x = 0;
preDeployedUnits[0].y = 0;
preDeployedUnits[0].player = 0;
preDeployedUnits[1].x = 0;
preDeployedUnits[1].y = 2;
preDeployedUnits[1].player = 1;

new Game(pMap, [0, 1], preDeployedUnits);