const functions = require('../../algorytm/al_smiles.js')


atomsList = new Array();
atomsList.push([ '0', 'O', 2, 85, 325 ]);
atomsList.push([ '1', 'C', 3, 85, 325 ]);
atomsList.push([ '2', 'O', 2, 85, 325 ]);
atomsList.push([ '3', 'O', 2, 85, 325 ]);
atomsList.push([ '4', 'O', 2, 85, 325 ]);
connectionList = new Array();
connectionList.push([ 1, 0 ]);
connectionList.push([ 2, 1 ]);
connectionList.push([ 0, 2 ]);
connectionList.push([ 1, 3 ]);
connectionList.push([ 4, 1 ]);
connectionList.push([ 3, 4 ]);


test('O1OC21(OO2)', () => {
  expect(al_smiles(atomsList,connectionList)).toBe("O1OC21(OO2)");
});
