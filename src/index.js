import './styles.scss';

let currentShip = 0;

let usablePlayerShips = [];

function createInitialGrid() {
	const CompField = document.getElementById("computer-field");
	let vertHor = 'H';

	const playerShips = [
		new Ship(5),
		new Ship(4),
		new Ship(3),
		new Ship(3),
		new Ship(2),
	];

	const changeOrientationButton = document.getElementById('changeOrionetation');

	for (let row = 1; row <= 10; row++) {
		for (let col = 'A'.charCodeAt(0); col <= 'J'.charCodeAt(0); col++) {
			const cell = document.createElement("button");
			cell.classList.add("cell");
			cell.id = `computer-field-${row}${String.fromCharCode(col)}`;

			if (vertHor == 'H') {
				cell.addEventListener('mouseover', (event) => handleCellHoverH(event, playerShips[currentShip].length - 1));
				cell.addEventListener('click', (event) => handleCellClick(event, playerShips));
			} else {
				cell.addEventListener('mouseover', (event) => handleCellHoverV(event, playerShips[currentShip].length - 1));
				cell.addEventListener('click', (event) => handleCellClick(event, playerShips));
			}

			CompField.appendChild(cell);
		}
	}

	changeOrientationButton.addEventListener('click', () => {
		vertHor = vertHor === 'H' ? 'V' : 'H';
		let displayedCells = document.querySelectorAll('.cell');
		displayedCells.forEach(cell => {
			if (vertHor == 'H') {
				cell.addEventListener('mouseover', (event) => handleCellHoverH(event, playerShips[currentShip].length - 1));
			} else {
				cell.addEventListener('mouseover', (event) => handleCellHoverV(event, playerShips[currentShip].length - 1));
			}
		});
	});

	usablePlayerShips = playerShips;
}

function handleCellClick(event, shipArray) {
	const clickedCell = event.target;
	const allCells = document.querySelectorAll('.cell');

	if (!clickedCell.dataset.marked == true) {
		allCells.forEach(cell => {
			if (cell.classList.contains('hovered')) {
				cell.dataset.marked = true;
				shipArray[currentShip].position.push(cell.id.substring("computer-field-".length));
			}
		});

		currentShip++;

		if (!shipArray[currentShip]) {
			allCells.forEach(cell => {
				cell.removeEventListener('mouseover', handleCellHoverH);
				cell.removeEventListener('mouseover', handleCellHoverV);
				cell.removeEventListener('click', handleCellClick);
			});

			createGrid();
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

	const allCells = document.querySelectorAll('.cell');
	allCells.forEach(cell => {
		cell.classList.remove('hovered');
	});

	for (let i = 1; i <= increment; i++) {
		const nextRow = parseInt(row) + i;
		const nextCellId = `computer-field-${parseInt(row) + i}${col}`;
		const nextCell = document.getElementById(nextCellId);

		if (nextCell && !nextCell.dataset.marked == true) {
			nextCell.classList.add('hovered');
			event.target.classList.add('hovered');
			allCells.forEach(cell => {
				cell.style.cursor = 'pointer';
			});
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

	const allCells = document.querySelectorAll('.cell');
	allCells.forEach(cell => {
		cell.classList.remove('hovered');
	});

	for (let i = 1; i <= increment; i++) {
		const nextCol = String.fromCharCode(col.charCodeAt(0) + i);
		const nextCellId = `computer-field-${row}${nextCol}`;
		const nextCell = document.getElementById(nextCellId);

		if (nextCell && !nextCell.dataset.marked == true) {
			nextCell.classList.add('hovered');
			event.target.classList.add('hovered');
			allCells.forEach(cell => {
				cell.style.cursor = 'pointer';
			});
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
const selectedCells = [];

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

			const allShipsSunk = ships.every(ship => ship.sunk === true);

			if (allShipsSunk) {
				document.getElementById('main-beam').innerText = 'Player Wins!'
				let allCellsVictory = document.querySelectorAll('.cell');
				allCellsVictory.forEach(cell => {
					cell.removeEventListener('click');
				});
			}

			button.disabled = true;

			computerMove();
		});
	});
}

function computerMove() {
	const computerFieldCells = document.querySelectorAll('#computer-field .cell');
	const randomIndex = Math.floor(Math.random() * computerFieldCells.length);
	const selectedCell = computerFieldCells[randomIndex];
	const trimmedCell = selectedCell.id.substring("computer-field-".length);
	console.log(trimmedCell)

	if (!selectedCell.dataset.shipHit && !selectedCell.disabled) {
		usablePlayerShips.forEach((ship) => {
			if (ship.position.includes(trimmedCell)) {
				ship.hit();
				selectedCell.dataset.shipHit = true;
			}
		});

		const allShipsSunkPlayer = usablePlayerShips.every(ship => ship.sunk === true);

		if (allShipsSunkPlayer) {
			document.getElementById('main-beam').innerText = 'Computer Wins!';
		}

		selectedCell.disabled = true;
	} else {
		computerMove();
	}
}

function checkCellAvailability(length) {
	let randomCells = getStartingCells(length);
	// let markedCell;

	randomCells.forEach(cell => {
		selectedCells.push(cell);
		// cell = 'player-field-' + cell;
		// markedCell = document.getElementById(cell);
		// markedCell.dataset.marked = true;
	});

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