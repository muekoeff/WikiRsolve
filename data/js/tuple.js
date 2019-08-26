class Tuple {
	constructor(searchquery, type, conditions) {
		this.searchquery = searchquery;
		if(typeof type != "undefined" && type !== "") this.type = type; else this.type = "q";
		if(typeof conditions != "undefined" && conditions !== "") this.conditions = conditions; else this.conditions = [];

		this.result = null;
	}

	attachUi(ui) {
		this.ui = ui;
	}
	validate() {
		if(this.type.toLowerCase() != "p" && this.type.toLowerCase() != "q") return false;
		return true;
	}
}