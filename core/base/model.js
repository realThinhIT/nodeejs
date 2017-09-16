import mongoose from 'mongoose';
let Schema = mongoose.Schema;

export default class Model {
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
        this._model = new Schema(this.schema(), Object.assign({}, this.defaultSchemeOptions, this.schemaOptions()));

        this.pre = this._model.pre;
        this.post = this._model.post;
        this.virtual = this._model.virtual;
        this.methods = this._model.methods;
        this.statics = this._model.statics;

        this.custom(this._model, this);
    }

    create() {
        this.__instance = mongoose.model(this.collectionName(), this._model);
        return this.__instance;
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

    /**
     * Gets new model instance
     * 
     * @returns 
     * @memberof Model
     */
    collection() {
        return mongoose.model(this.collectionName());
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
    schema() {
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
    customs(model, self) {

    }
}