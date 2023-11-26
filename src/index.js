import './styles.scss';

// Computer populated cells
const selectedCells = [];

// Populate player grid
function createGrid() {
	const field = document.getElementById("player-field");

	// Create 5 ship objects
	const ships = [
		new Ship(5),
		new Ship(4),
		new Ship(3),
		new Ship(3),
		new Ship(2),
	];

	for (let row = 1; row <= 10; row++) {
		for (let col = 'A'.charCodeAt(0); col <= 'J'.charCodeAt(0); col++) {
			const cell = document.createElement("button");
			cell.classList.add("cell");
			cell.id = `player-field-${row}${String.fromCharCode(col)}`;
			field.appendChild(cell);
		}
	}

	ships.forEach((ship) => {
		console.log(checkCellAvailability(ship.length))
		if (checkCellAvailability(ship.length)) {
			randomCells.forEach(cell => {
				selectedCells.push(cell);
			});

			console.log(selectedCells)
			let markedCell;

			randomCells.forEach((cell) => {
				cell = 'player-field-' + cell;
				markedCell = document.getElementById(cell);
				markedCell.dataset.marked = true;
			})
		}
	});
}

function checkCellAvailability(length) {
	const randomCells = getStartingCells(length);
	randomCells.forEach(cell => {
		if (selectedCells.includes(cell)) {
			checkCellAvailability(length);
		}
		return true;
	});
}

function getStartingCells(length) {
	const row = Math.floor(Math.random() * 10) + 1;
	const col = String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 10));


	if (row + (length - 1) > 10) {
		return getStartingCells(length);
	} else {
		let selectedCellsShip = [];
		let tempCell;

		for (let i = 0; i < length; i++) {
			let arrayIncrement = row + i;
			tempCell = arrayIncrement + col;
			selectedCellsShip.push(tempCell);
		}

		// console.log(selectedCellsShip)
		return selectedCellsShip;
	}
}

class Ship {
	constructor(length) {
		this.length = length;
		this.hits = 0;
		this.sunk = false;
	}

	hit() {
		this.hits++;
		if (this.hits === this.length) {
			this.sunk = true;
			console.log(`Ship of length ${this.length} has been sunk!`);
		} else {
			console.log(`Ship hit! ${this.hits} out of ${this.length} hits.`);
		}
	}
}

createGrid();