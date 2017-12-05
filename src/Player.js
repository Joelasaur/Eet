class Player {
	
	constructor(aName, anID) {
		if(aName == "" && anID == "food") {
			this.size = .5;
			this.x = Math.floor(Math.random() * 595) + 5;
			this.y = Math.floor(Math.random() * 795) + 5;
		} else {
			this.name = aName;
			this.id = anID;
			this.size = 5;
			this.x = 0;
			this.y = 0;
			this.dt = 0.5;
			this.col = "#3A3";
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
