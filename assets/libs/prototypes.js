Object.prototype.isEmpty = function() {
	for(var key in this) {
		if(this.hasOwnProperty(key))
			return false;
	}
	return true;
};