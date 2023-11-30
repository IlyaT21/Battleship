import './styles.scss';

function createInitialGrid() {
	const CompField = document.getElementById("computer-field");
	let vertHor = 'H';

	const changeOrientationButton = document.getElementById('changeOrionetation');

	const playerShips = [
		new Ship(5),
		new Ship(4),
		new Ship(3),
		new Ship(3),
		new Ship(2),
	];

	playerShips.forEach((ship) => {
		changeOrientationButton.addEventListener('click', () => {
			vertHor = vertHor === 'H' ? 'V' : 'H';
			let displayedCells = document.querySelectorAll('.cell');
			displayedCells.forEach(cell => {
				if (vertHor == 'H') {
					cell.addEventListener('mouseover', (event) => handleCellHoverH(event, ship.length));
				} else {
					cell.addEventListener('mouseover', (event) => handleCellHoverV(event, ship.length));
				}
			});
		});
	});

	for (let row = 1; row <= 10; row++) {
		for (let col = 'A'.charCodeAt(0); col <= 'J'.charCodeAt(0); col++) {
			const cell = document.createElement("button");
			cell.classList.add("cell");
			cell.id = `computer-field-${row}${String.fromCharCode(col)}`;

			if (vertHor == 'H') {
				cell.addEventListener('mouseover', (event) => handleCellHoverH(event, 4));
			} else {
				cell.addEventListener('mouseover', (event) => handleCellHoverV(event, 4));
			}


			CompField.appendChild(cell);
		}
	}
}

function handleCellHoverV(event, increment) {
	const currentCellId = event.target.id;
	let row;
	let col;

	if (currentCellId.includes('10')) {
		row = '10';
		col = currentCellId.charAt(17);
	} else {
		const rowTemp = currentCellId.slice(15);
		col = currentCellId.charAt(16);
		row = rowTemp[0];
	}

	console.log(row + col)

	const allCells = document.querySelectorAll('.cell');
	allCells.forEach(cell => {
		cell.classList.remove('hovered');
	});

	for (let i = 1; i <= increment; i++) {
		const nextRow = parseInt(row) + i;
		const nextCellId = `computer-field-${parseInt(row) + i}${col}`;
		const nextCell = document.getElementById(nextCellId);

		if (nextCell) {
			nextCell.classList.add('hovered');
			event.target.classList.add('hovered');
			allCells.forEach(cell => {
				cell.style.cursor = 'pointer';
			});
		} else {
			const currentCell = document.getElementById(`computer-field-${row}${col}`);
			console.log(currentCell)
			if (currentCell) {
				currentCell.style.cursor = 'not-allowed';
				allCells.forEach(cell => {
					cell.classList.remove('hovered');
				});
			}
			break;
		}
	}
}

function handleCellHoverH(event, increment) {
	const currentCellId = event.target.id;
	let row;
	let col;

	if (currentCellId.includes('10')) {
		row = '10';
		col = currentCellId.charAt(17);
	} else {
		const rowTemp = currentCellId.slice(15);
		col = currentCellId.charAt(16);
		row = rowTemp[0];
	}

	console.log(row + col)

	const allCells = document.querySelectorAll('.cell');
	allCells.forEach(cell => {
		cell.classList.remove('hovered');
	});

	for (let i = 1; i <= increment; i++) {
		const nextCol = String.fromCharCode(col.charCodeAt(0) + i);
		const nextCellId = `computer-field-${row}${nextCol}`;
		const nextCell = document.getElementById(nextCellId);

		if (nextCell) {
			nextCell.classList.add('hovered');
			event.target.classList.add('hovered');
		} else {
			const currentCell = document.getElementById(`computer-field-${row}${col}`);
			if (currentCell) {
				currentCell.style.cursor = 'not-allowed';
				allCells.forEach(cell => {
					cell.classList.remove('hovered');
				});
			}
			break;
		}
	}
}

// Populate player grid
function createGrid() {
	// Computer populated cells
	const selectedCells = [];

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
		ship.position = checkCellAvailability(ship.length);
		console.log(ship.position)
	});

	const playerButtons = document.querySelectorAll('#player-field .cell');

	playerButtons.forEach(button => {
		button.addEventListener('click', (e) => {
			const strippedId = button.id.substring("player-field-".length);

			ships.forEach(ship => {
				if (ship.position.includes(`${strippedId}`)) {
					console.log(`Ship with length ${ship.length} has the cell ${strippedId} in its position.`);
					ship.hit();
					button.dataset.shipHit = true;
				}
			});

			button.disabled = true;
		});
	});
}

function checkCellAvailability(length) {
	let randomCells = getStartingCells(length);
	let markedCell;

	// randomCells.forEach(cell => {
	// 	selectedCells.push(cell);
	// 	cell = 'player-field-' + cell;
	// 	markedCell = document.getElementById(cell);
	// 	markedCell.dataset.marked = true;
	// });

	return randomCells;
}

function getStartingCells(length) {
	const row = Math.floor(Math.random() * 10) + 1;
	const col = String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random() * 10));

	const randomValue = Math.random();

	if (randomValue < 0.5) {
		if (col.charCodeAt(0) + (length - 1) > 'J'.charCodeAt(0) || selectedCells.includes(row + col)) {
			return getStartingCells(length);
		} else {
			let selectedCellsShip = [];
			let tempCell;

			for (let i = 0; i < length; i++) {
				let arrayIncrement = String.fromCharCode(col.charCodeAt(0) + i);
				tempCell = row + arrayIncrement;
				if (selectedCells.includes(tempCell)) {
					return getStartingCells(length);
				} else {
					selectedCellsShip.push(tempCell);
				}
			}

			return selectedCellsShip;
		}
	} else {
		if (row + (length - 1) > 10 || selectedCells.includes(row + col)) {
			return getStartingCells(length);
		} else {
			let selectedCellsShip = [];
			let tempCell;

			for (let i = 0; i < length; i++) {
				let arrayIncrement = row + i;
				tempCell = arrayIncrement + col;
				if (selectedCells.includes(tempCell)) {
					return getStartingCells(length);
				} else {
					selectedCellsShip.push(tempCell);
				}
			}

			return selectedCellsShip;
		}
	}
}

class Ship {
	constructor(length) {
		this.length = length;
		this.hits = 0;
		this.sunk = false;
		this.position = [];
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

// createGrid();

createInitialGrid();