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

	doDeteriation() {
		for(var item in this.playerList) {
			if(this.playerList[item].size > 12) {
				this.playerList[item].deteriate();
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

	move(direction, dt, UUID, canvasW, canvasH) {
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

			//MAP BOUNDS
			if(this.playerList[UUID].x - this.playerList[UUID].size <= 0) {
				this.playerList[UUID].x = 0 + this.playerList[UUID].size;
			}

			if(this.playerList[UUID].y - this.playerList[UUID].size <= 0) {
				this.playerList[UUID].y = 0 + this.playerList[UUID].size;
			}

			if((this.playerList[UUID].x + this.playerList[UUID].size) >= canvasW) {
				this.playerList[UUID].x = canvasW - this.playerList[UUID].size;
			}

			if((this.playerList[UUID].y + this.playerList[UUID].size) >= canvasH) {
				this.playerList[UUID].y = canvasH - this.playerList[UUID].size;
			}
		}
	}
}

module.exports = GameBoard;
