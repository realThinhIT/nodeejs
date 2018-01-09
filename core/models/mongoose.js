import mongoose from 'mongoose';
let Schema = mongoose.Schema;

export default class MongooseModel {
  /**
   * Creates a new instance of model
   * 
   * @memberof Model
   */
  constructor() {
    this.defaultSchemeOptions = {
      collection: this.collectionName(),
      safe: true,
      toJSON: { virtuals: true }
    };

    this.mongoose = mongoose;
    this._model = new Schema(this.shape(), Object.assign({}, this.defaultSchemeOptions, this.schemaOptions()));

    this.custom(this._model, this, this.instance());
  }

  /**
   * Creates an instance of mongoose model from ES6 class
   * 
   * @param {*} modelClass 
   */
  create(modelClass = class Default {}) {
    this._model.loadClass(modelClass);
    this.__instance = mongoose.model(this.collectionName(), this._model);
    return this.__instance;
  }

  /**
   * An utility to instantiate a model from ES6 class
   * without having to heavily rely on custom method
   * 
   * @static
   * @param {*} model 
   * @returns an instantiated mongoose model
   * @memberof MongooseModel
   */
  static create(model = class Default {}) {
    let map = {
      Model: model
    };

    const newModel = new map['Model']();
    return newModel.create(model);
  }

  /**
   * Gets class name of Model
   * 
   * @returns 
   * @memberof Model
   */
  modelName() {
    return this.constructor.name;
  }

  /**
   * Gets the model instance (current schema)
   * 
   * @returns 
   * @memberof Model
   */
  model() {
    return this._model;
  }

  instance() {
    return this.__instance;
  }

  /**
   * Gets 
   * 
   * @returns 
   * @memberof Model
   */
  collectionName() {
    return this.modelName();
  }

  /**
   * Indentifies if this model uses timestamps
   * 
   * @returns 
   * @memberof Model
   */
  timestamps() {
    return true;
  }

  /**
   * Defines the model schema
   * 
   * @returns 
   * @memberof Model
   */
  shape() {
    return {};
  }

  /**
   * Defines the model schema options
   * 
   * @returns 
   * @memberof Model
   */
  schemaOptions() {
    return this.defaultSchemeOptions;
  }

  /**
   * Defines the customs functions for model
   * 
   * @param {any} model 
   * @memberof Model
   */
  customs(model, self, collection) {

  }
}