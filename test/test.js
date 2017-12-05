var assert = require("assert");
var Eet = require("../src/Eet.js");
var Player = require("../src/Player.js");
var GameBoard = require("../src/GameBoard.js");

describe('Player', function() {
	var aPlayer;

	beforeEach(function buildPlayer() {
		aPlayer = new Player("Joel");
	});

	describe('#grow', function() {
		it("should increase the player's size", function() {
			var expected = 9;
			aPlayer.grow(4);
			var results = aPlayer.size;
  			assert.equal(expected, results);
		});
	});

	describe('#kill', function() {
		it("should set the player's size to 0", function() {
			var expected = 0;
			aPlayer.kill();
			var results = aPlayer.size;
  			assert.equal(expected, results);
		});
	});

});

describe('GameBoard', function() {
	var aGameBoard;
	var player1, player2;

	beforeEach(function buildPlayer() {
		player1 = new Player("Joel", "abcd");
		player2 = new Player("Justin", "efgh");
		aGameBoard = new GameBoard();
	});

	describe('#addPlayer', function() {
		it("should add player to a dictionary of players", function() {
			var expected = 2;
			aGameBoard.addPlayer(player1);
			aGameBoard.addPlayer(player2);
			var results = aGameBoard.getNumPlayers();
			assert.equal("abcd", player1.id);
			assert.equal("efgh", player2.id);

			//Make sure dictionary is created correctly.
			assert.equal(player1, aGameBoard.playerList[player1.id]);
  			assert.equal(expected, results);
		});
	});

	describe('#move', function() {
		it("should take a direction and delta time, and update the playerlist accordingly", function() {
			var expected = 4; //Where we expect the player to be in the x direction after issuing a "move right" command.
			aGameBoard.addPlayer(player1);
			aGameBoard.move("right", player1.dt, player1.id);
			results = aGameBoard.playerList[player1.id].x; 
  			assert.equal(expected, results);
		});
	});
});

describe('Eet', function() {
	var anEet;
	var player1, player2, player3;

	beforeEach(function buildPlayer() {
		player1 = new Player("Joel", "a");
		player2 = new Player("Justin", "b");
		player3 = new Player("Matt", "c");
		anEet = new Eet();
	});

	describe('#joinGame', function() {
		it("should add players to the gameboard", function() {
			var expected = 3;
			anEet.joinGame(player1);
			anEet.joinGame(player2);
			anEet.joinGame(player3);
			var results = anEet.board.getNumPlayers();
  			assert.equal(expected, results);
		});
	});
});

