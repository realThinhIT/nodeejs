import BaseModel from '../base/base-model';
import Sequelize from 'sequelize';

export default class SequelizeModel extends BaseModel {
  constructor(...args) {
    super(...args);

    this.underscored = true;
    this.sequelize = Sequelize;
  }

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
   * Creates an instance of sequelize model from ES6 class
   */
  create(modelClass = class Default {}) {
    // create an instance
    this.__instance = this.sequelize.define({
      ...this.shape
    }, {
      underscored: this.underscored,
      defaultScopes: this.defaultScopes,
      scopes: this.scopes,
      hooks: this.hooks,
      classMethods: this.classMethods,
      instanceMethods: this.instanceMethods
    });

    // runs custom definitions
    this.customs(this.__instance, this);

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
   * Returns an object of class static methods 
   * 
   * @readonly
   * @memberof SequelizeModel
   */
  get classMethods() {
    return {};
  }

  /**
   * Returns an object of instance methods 
   * 
   * @readonly
   * @memberof SequelizeModel
   */
  get instanceMethods() {
    return {};
  }

  /**
   * Returns an object of hooks
   * 
   * @readonly
   * @memberof SequelizeModel
   */
  get hooks() {
    return {};
  }

  /**
   * Returns an object of default scopes
   * 
   * @readonly
   * @memberof SequelizeModel
   */
  get defaultScopes() {
    return {};
  }

  /**
   * Returns an object of scopes
   * 
   * @readonly
   * @memberof SequelizeModel
   */
  get scopes() {
    return {};
  }

  /**
   * Defines the customs functions for model
   * 
   * @param {any} model 
   * @memberof Model
   */
  customs(model, self) {

  }
}