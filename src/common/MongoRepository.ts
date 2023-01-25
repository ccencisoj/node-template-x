import { Model } from "mongoose";
import { IEntity } from "./IEntity";
import { Pagination } from "./Pagination";
import { IRepository } from "./IRepository";

export class MongoRepository<Entity extends IEntity> implements IRepository<Entity> {
  private readonly limit = 50;
  private readonly model: Model<Entity>;
  private readonly searchables: string[];

  constructor(model: Model<Entity>, searchables: string[]) {
    this.model = model;
    this.searchables = searchables;
  }

  private getSearchQuery = async (searchValue?: string): Promise<object> => {
    const searchQueryOr = [];
    
    for(let searchable of this.searchables) {
      const searchableQuery = {$regex: `.*${searchValue || ""}.*`, $options: "i"};

      searchQueryOr.push({[searchable]: searchableQuery});
    }

    return {$or: searchQueryOr};
  }

  public count = async (filter: object, searchValue?: string): Promise<number> => {
    filter = {isDeleted: false, ...filter, ...this.getSearchQuery(searchValue)};
    
    const count = await this.model.count(filter);

    return count;
  }

  public exists = async (filter: Partial<Entity>, searchValue?: string): Promise<boolean> => {
    filter = {isDeleted: false, ...filter, ...this.getSearchQuery(searchValue)};
    
    const exists = !!(await this.model.findOne(filter));

    return exists;
  }
  
  public save = async (entity: Entity): Promise<void> => {
    const entityExists = await this.exists({id: entity.id} as Partial<Entity>);

    if(entityExists) {
      await this.model.updateOne({id: entity.id}, entity);
    }else {
      await this.model.create(entity);
    }
  }

  public findOne = async (filter: object, searchValue?: string): Promise<Entity> => {
    filter = {isDeleted: false, ...filter, ...this.getSearchQuery(searchValue)};
    
    const entity = await this.model.findOne(filter);
    const entityObj = entity.toObject<Entity>();

    return entityObj;
  }

  public findMany = async (filter: object, page?: number, searchValue?: string): Promise<Entity[]> => {
    filter = {isDeleted: false, ...filter, ...this.getSearchQuery(searchValue)};
    
    const entities = await this.model.find(filter).skip((page || 0) * this.limit).limit(this.limit);
    const entitiesObj = entities.map((entity)=> entity.toObject<Entity>());

    return entitiesObj;
  }

  public paginate = async (filter: Partial<Entity>, page?: number, searchValue?: string): Promise<Pagination> => {
    filter = {isDeleted: false, ...filter, ...this.getSearchQuery(searchValue)};

    const totalDocs = await this.count(filter, searchValue);
    const pagination = new Pagination((page || 0), this.limit, totalDocs);

    return pagination;
  }  
}
