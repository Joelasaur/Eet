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
		if(this.foods < 100 ) {
			for(var i=0; i < 25; i++) {
				this.playerList[this.foods] = new Player("", "food", "#567", this.foods);
				this.foods++;
			}
		}
	}

	growPlayer(id, sizeToAdd) {
		this.playerList[id].grow(sizeToAdd);
	}

	killPlayer(id) {
		this.playerList[id].kill();

		this.foods--;
		//var index = this.playerList.indexOf(id);
		//this.playerList.splice(index, 1);
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
				this.playerList[UUID].x += dt * .2;
			}
			if (direction.left) {
				this.playerList[UUID].x -= dt * .2;
			}
			if (direction.up) {
				this.playerList[UUID].y -= dt * .2;
			}
			if (direction.down) {
				this.playerList[UUID].y += dt * .2;
			}
		}
	}
}

module.exports = GameBoard;
