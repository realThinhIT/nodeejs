export default class BaseModel {
  /**
   * Defines the model schema
   * 
   * @returns 
   * @memberof Model
   */
  get shape() {
    return {};
  }

  /**
   * Gets class name of Model
   * 
   * @returns 
   * @memberof Model
   */
  get modelName() {
    return this.constructor.name;
  }

  /**
   * Creates an instance of mongoose model from ES6 class
   */
  create(modelClass = class Default {}) {
    return this.__instance;
  }

  /**
   * An utility to instantiate a model from ES6 class
   * without having to heavily rely on custom method
   * 
   * @static
   * @param {*} model 
   * @returns an instantiated model
   */
  static create(model = class Default {}) {
    let map = {
      Model: model
    };

    const newModel = new map['Model']();
    return newModel.create(model);
  }

  /**
   * Defines the customs functions for model
   * 
   * @param {any} model 
   * @memberof Model
   */
  customs(model) {

  }
}