var Player = require("./Player.js");

class GameBoard {
	constructor() {
		this.playerList = {};
		this.foods = 0;
	}

	addPlayer(player) {
		this.playerList[player.id] = player;
	}

	doFoodGeneration() {
		if(this.foods < 500 ) {
			for(var i=0; i < 500; i++) {
				this.playerList[i] = new Player("", "food");
				this.foods++;
			}
		}
	}

	getPlayers() {
		return this.playerList;
	}

	getNumPlayers() {
		return Object.keys(this.playerList).length;
	}

	move(direction, dt, UUID) {
		if(this.playerList[UUID]) {
			//console.log(direction + " :: " + UUID);
			//console.log(this.playerList[UUID].x);
			if (direction.right) {
				this.playerList[UUID].x += dt * .5;
			}
			if (direction.left) {
				this.playerList[UUID].x -= dt * .5;
			}
			if (direction.up) {
				this.playerList[UUID].y -= dt * .5;
			}
			if (direction.down) {
				this.playerList[UUID].y += dt * .5;
			}
		}
	}
}

module.exports = GameBoard;
