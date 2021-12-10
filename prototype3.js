// Atomy

atomsList = new Array();

atomsList.push([ '0', 'O', 2, 85, 325 ]);
atomsList.push([ '1', 'C', 3, 85, 325 ]);
atomsList.push([ '2', 'O', 2, 85, 325 ]);
atomsList.push([ '3', 'O', 2, 85, 325 ]);
atomsList.push([ '4', 'O', 2, 85, 325 ]);

connectionList = new Array();
//connectionList.push([ 0, 1 ]);
//connectionList.push([ 1, 2 ]);
//connectionList.push([ 2, 0 ]);
//
//connectionList.push([ 3, 1 ]);
//connectionList.push([ 1, 4 ]);
//connectionList.push([ 4, 3 ]);

connectionList.push([ 1, 0 ]);
connectionList.push([ 2, 1 ]);
connectionList.push([ 0, 2 ]);

connectionList.push([ 1, 3 ]);
connectionList.push([ 4, 1 ]);
connectionList.push([ 3, 4 ]);

//  o=c=nc
var atomsGraph = new Array();
var signs = [ '', '=', '#' ];

// create an aggregate list off all features of components of graph(molecule), like their relations
for (i = 0; i < atomsList.length; i++) {
	lst_connections = [];
	connectionList.forEach((element) => {
		if (element[0] == i) {
			lst_connections.push(element[1]);
		}
	});
	//var atm = new Atom(i,atomsList[i][0],atomsList[i][2],lst_connections)
	atomsGraph.push([ i, atomsList[i][1], atomsList[i][2], connectionListToCount(lst_connections) ]);
}

//sort elements of molcule by amount of connections to later get element with leat conections
atomsGraph.sort((a, b) => {
	return a[2] > b[2];
});

// in this function we map indyviudal conections to their amount in molecule
function connectionListToCount(connections) {
	//input: [1, 2, 3, 3,4,4,4] outpt: {1:1,2:1,3:2,4:3}
	const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

	var output = {};
	connections.forEach((element) => {
		output[element] = countOccurrences(connections, element);
	});
	return output;
}

// this function is used to get starting element of molecule to build smiles
function get_start(atomsGraph) {
	var start;
	atomsGraph.some(function(el) {
		start = el;
		return el[1] != 'H';
	});
	return start;
}

//setting up empty variables
start = get_start(atomsGraph);
var visited = [];
var current = start;
var rec_stack = [];

var cycles = [];
smiles = '';
smiles_ghost = '';

var current_cycle_id = 0;

function getCycleId(el_id) {
	current_cycle_id++;
	var position = smiles_ghost.search(el_id);
	var new_smiles = smiles.slice(0, position + 1) + current_cycle_id + smiles.slice(position + 1);
	//this bit assumes that there is never hoing to be more than 9 cycles TODO: PriestOfAdanos add support for unconstrained amount
	var new_smiles_ghost = smiles_ghost.slice(0, position + 1) + 'X' + smiles_ghost.slice(position + 1);
	smiles = new_smiles;
	smiles_ghost = new_smiles_ghost;
	return current_cycle_id.toString();
}

function current_to_next(current, parent) {
	smiles += current[1];
	smiles_ghost += current[0];
	visited.push(current[0].toString());

	Object.keys(current[3]).forEach((element) => {
		if (parent[0] != element && visited.includes(element)) {
			c_id = getCycleId(element);
			smiles += c_id;
			smiles_ghost += 'X';
		}
		if (atomsGraph[element][1] == 'H' && !visited.includes(element)) {
			visited.push(atomsGraph[element][0]);
		} else if (!visited.includes(element)) {
			if (Object.keys(current[3]).length > 1) {
				smiles += '(';
				smiles_ghost += '(';
			}
			smiles += signs[current[3][element] - 1];
			smiles_ghost += signs[current[3][element] - 1];
			current_to_next(atomsGraph.find((item) => element == item[0]), current);
			if (Object.keys(current[3]).length > 1) {
				smiles += ')';
				smiles_ghost += ')';
			}
		}
	});
}
console.log(atomsGraph);

var ot = current_to_next(current, current);
console.log(smiles);

//O(=C=NC)(=O)

//console.log(atomsGraph);
