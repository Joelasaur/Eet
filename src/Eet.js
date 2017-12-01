var GameBoard = require("./GameBoard.js");

class Eet {

	// shopDB is a MongoDB database 
	constructor(shopDB) {
		this.shop = shopDB;
		this.board = new GameBoard();
	}

	joinGame(player) {
		this.board.addPlayer(player);
		//TODO: Database interactions need their own functions. This line needs to go somewhere else.
		this.shop.collection("players").insertOne({UUID: player.id, name: player.name, highScore: 1})
	}
}

module.exports = Eet;