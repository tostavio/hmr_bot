"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async findAll(options) {
        return this.model.findAll(options);
    }
    async findOne(options) {
        return this.model.findOne(options);
    }
    async create(data, options) {
        return this.model.create(data, options);
    }
    async update(data, options) {
        return this.model.update(data, options);
    }
    async delete(options) {
        return this.model.destroy(options);
    }
}
exports.BaseRepository = BaseRepository;
