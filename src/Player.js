class Player {

	constructor(aName, anID, color, index) {
		if(aName == "" && anID == "food") {
			this.size = 2;
			this.x = Math.floor(Math.random() * 1400) + 5;
			this.y = Math.floor(Math.random() * 700) + 5;
			this.id = index;
			this.col = "#3A3";
			this.name = aName;
		} else {
			this.name = aName;
			this.id = anID;
			this.size = 8;
			this.x = 40;
			this.y = 40;
			this.dt = 0.5;
			this.col = color;
		}
	}

	grow(amount) {
		this.size += amount;
	}

	kill() {
		this.size = 0;
	}
}

module.exports = Player;
