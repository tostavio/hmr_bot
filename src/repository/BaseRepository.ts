import {
  Model,
  ModelStatic,
  FindOptions,
  CreateOptions,
  DestroyOptions,
  UpdateOptions,
  Attributes,
} from "sequelize";

export class BaseRepository<T extends Model> {
  constructor(private model: ModelStatic<T>) {}

  async findAll(options?: FindOptions<Attributes<T>>): Promise<T[]> {
    return this.model.findAll(options);
  }

  async findOne(options?: FindOptions<Attributes<T>>): Promise<T | null> {
    return this.model.findOne(options);
  }

  async create(data: Attributes<T>, options?: CreateOptions): Promise<T> {
    return this.model.create(data, options);
  }

  async update(
    data: Partial<Attributes<T>>,
    options: UpdateOptions<Attributes<T>>
  ): Promise<[number]> {
    return this.model.update(data, options);
  }

  async delete(options: DestroyOptions<Attributes<T>>): Promise<number> {
    return this.model.destroy(options);
  }
}
