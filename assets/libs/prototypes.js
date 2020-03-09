Object.prototype.isEmpty = function() {
	for(let key in this) {
		if(this.hasOwnProperty(key))
			return false;
	}
	return true;
};