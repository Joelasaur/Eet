class Player {
	constructor(aName, anID, aColor) {
		this.name = aName;
		this.id = anID;
		this.color = aColor;
		this.size = 1;
		this.x = 0;
		this.y = 0;
		this.dt = 0.5;
	}

	grow(amount) {
		this.size += amount;
	}

	kill() {
		this.size = 0;
	}
}

module.exports = Player;
