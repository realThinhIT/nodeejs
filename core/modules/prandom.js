module.exports = {
	string: function (len, charSet) {
		charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$.=-#@!~';
		len = len || this.int();

		var randomString = '';
		for (var i = 0; i < len; i++) {
			var randomPoz = Math.floor(Math.random() * charSet.length);
			randomString += charSet.substring(randomPoz, randomPoz + 1);
		}

		return randomString;
	},

    int: function (min, max) {
		min = min || 0;
		max = max || 9999999;

        return Math.floor(Math.random() * (max - min)) + min;
    }
};
