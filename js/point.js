function Point (x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;

	this.toString = function () {
		if (this.z)
			return '(' + this.x + ', ' + this.y + ', ' + this.z + ')';
		else
			return '(' + this.x + ', ' + this.y + ')';
	}
}