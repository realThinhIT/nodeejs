export default {
  string(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$.=-#@!~';
    len = len || this.int();

    let randomString = '';
    for (let i = 0; i < len; i++) {
      let randomPoz = Math.floor(Math.random() * charSet.length);
      randomString += charSet.substring(randomPoz, randomPoz + 1);
    }

    return randomString;
  },

  int(min = 0, max = 9999999) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
};
