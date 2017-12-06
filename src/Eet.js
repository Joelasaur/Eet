var GameBoard = require("./GameBoard.js");
var Player = require("./Player.js");

class Eet {

	// shopDB is a MongoDB database
	constructor(shopDB) {
		this.shop = shopDB;
		this.board = new GameBoard();
	}

	getPlayers() {
		return this.board.getPlayers();
	}

	joinGame(player) {
		this.board.addPlayer(player);
		//this.shop.collection("players").insertOne({UUID: player.id, name: player.name, highScore: 1})
	}
	addPlayerToDB(player){
		var playerObj = {name: player.name, color: player.color, highScore: 1};
		this.shop.collection("players").updateOne({name: player.name},playerObj, {upsert: true}, function(err, data){
			if(err){
				console.log(err);
			}
			else{
				console.log("update successful");
			}
		});
	}

	createOrGetPlayer(name, id, color) {
		//TODO: Get player from database
		var player = new Player(name, id, color, null);
		return player;
	}
}

module.exports = Eet;
