import { Pagination } from "./Pagination";

export interface IRepository<Entity> {
  count(filter: Partial<Entity>, searchValue?: string): Promise<number>;
  exists(filter: Partial<Entity>, searchValue?: string): Promise<boolean>;
  save(entity: Entity): Promise<void>;
  findOne(filter: Partial<Entity>, searchValue?: string): Promise<Entity>;
  findMany(filter: Partial<Entity>, page?: number, searchValue?: string): Promise<Entity[]>;
  paginate(filter: Partial<Entity>, page?: number, searchValue?: string): Promise<Pagination>;
}
