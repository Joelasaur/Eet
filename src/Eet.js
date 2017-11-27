var GameBoard = require("./GameBoard.js");

class Eet {
	constructor() {
		this.board = new GameBoard();
		this.shop = {};
	}

	joinGame(player) {
		this.board.addPlayer(player);
	}
}

module.exports = Eet;