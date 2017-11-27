class GameBoard {
	constructor() {
		this.playerList = {};
	}

	addPlayer(player) {
		this.playerList[player.id] = player;
	}

	getNumPlayers() {
		return Object.keys(this.playerList).length;
	}

	move(direction, dt, UUID) {
		if (direction == "right") {
			this.playerList[UUID].x += dt * 8;
		}
	}
}

module.exports = GameBoard;