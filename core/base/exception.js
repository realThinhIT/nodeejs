export default class Exception extends Error {
  /**
   * Construct an custom Exception
   * 
   * @param {any} message 
   * @param {any} code 
   * @memberof Exception
   */
  constructor(message, code, detailCode) {
    super();

    if (message instanceof Error) {
      this.message = message.message;
    } else {
      this.message = message; 
    }

    this.code = code ? code : '_err';
    this.detailCode = detailCode ? detailCode : '_err';
    this.stack = (new Error()).stack;
    this.name = this.constructor.name;
  }
}