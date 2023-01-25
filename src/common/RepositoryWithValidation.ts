import { IEntity } from "./IEntity";
import { Pagination } from "./Pagination";
import { IRepository } from "./IRepository";
import { ValidationSchema } from "./ValidationSchema";
import { ValidationResult } from "./ValidationResult";
import { RequiredException } from "../exceptions/RequiredException";
import { ValidationException } from "../exceptions/ValidationException";
import { AlreadyExistsException } from "../exceptions/AlreadyExistsException";

export class RepositoryWithValidation<Entity extends IEntity> implements IRepository<Entity> {
  public readonly repository: IRepository<Entity>;
  public readonly validationSchema: ValidationSchema<Entity>;
  
  constructor(repository: IRepository<Entity>, validationSchema: ValidationSchema<Entity>) {
    this.repository = repository;
    this.validationSchema = validationSchema;
  }

  public count = async (filter: Partial<Entity>, searchValue?: string): Promise<number> => {
    const validationResult = ValidationResult.combine([
      this.validateFilter(filter),
      this.validateSearchValue(searchValue)
    ])

    if(validationResult.isError) {
      throw new ValidationException(validationResult.error);
    }
    
    return this.repository.count(filter, searchValue);
  }

  public exists = async (filter: Partial<Entity>, searchValue?: string): Promise<boolean> => {
    const validationResult = ValidationResult.combine([
      this.validateFilter(filter),
      this.validateSearchValue(searchValue)
    ])

    if(validationResult.isError) {
      throw new ValidationException(validationResult.error);
    }

    return this.repository.exists(filter, searchValue);
  }

  public save = async (entity: Entity): Promise<void> => {
    const validationResult = this.validateEntity(entity);

    if(validationResult.isError) {
      throw new ValidationException(validationResult.error);
    }    

    // Check required properties
    await this.checkRequiredProperties(entity);

    // Check unique properties
    await this.checkUniqueProperties(entity);

    return this.repository.save(entity);
  }
  
  public findOne = async (filter: Partial<Entity>, searchValue?: string): Promise<Entity> => {
    const validationResult = this.validateFilter(filter);

    if(validationResult.isError) {
      throw new ValidationException(validationResult.error);
    }

    return this.repository.findOne(filter, searchValue);
  }

  public findMany = async (filter: Partial<Entity>, page?: number, searchValue?: string): Promise<Entity[]> => {
    const validationResult = ValidationResult.combine([
      this.validateFilter(filter),
      this.validatePage(page),
      this.validateSearchValue(searchValue)
    ])

    if(validationResult.isError) {
      throw new ValidationException(validationResult.error);
    }

    return this.repository.findMany(filter, page, searchValue);
  }

  public paginate = async (filter: Partial<Entity>, page?: number, searchValue?: string): Promise<Pagination> => {
    const validationResult = ValidationResult.combine([
      this.validateFilter(filter),
      this.validatePage(page),
      this.validateSearchValue(searchValue)
    ])

    if(validationResult.isError) {
      throw new ValidationException(validationResult.error);
    }

    return this.repository.paginate(filter, page, searchValue);
  }

  private checkUniqueProperties = async (entity: Entity): Promise<void> => {
    for(const [entityKey, entityValue] of Object.entries(entity)) {
      if(!this.validationSchema.containUniqueProperty(entityKey)) continue;

      const repoEntity = await this.findOne({[entityKey]: entityValue} as Partial<Entity>);

      if(repoEntity && !(repoEntity.id === entity.id)) {
        throw new AlreadyExistsException(`${entityKey} '${entityValue}' already exists`); 
      }
    }
  }

  private checkRequiredProperties = async (entity: Entity): Promise<void> => {
    for(const [entityKey, entityValue] of Object.entries(entity)) {
      if(!entityValue && this.validationSchema.containRequiredProperty(entityKey)) {
        throw new RequiredException(`Required '${entityKey}'`);
      }
    }
  }

  private validatePage = (page?: number): ValidationResult => {
    if(!page) return ValidationResult.ok();

    const containOnlyNumbers = /[0-9]/.test(page.toString());
    
    if(!(containOnlyNumbers && typeof page === "number")) {
      return ValidationResult.error("The page must be a number");
    }

    return ValidationResult.ok();
  }
  
  private validateFilter = (filter: Partial<Entity>): ValidationResult => {

    for(const [filterKey, filterValue] of Object.entries(filter)) {
      if(!this.validationSchema.containProperty(filterKey)) continue;

      const validationResult = this.validationSchema.validate(filterKey, filterValue);

      if(validationResult.isError) return validationResult;
    }

    return ValidationResult.ok();
  }

  private validateEntity = (entity: Entity): ValidationResult => {

    for(const [entityKey, entityValue] of Object.entries(entity)) {
      if(!this.validationSchema.containProperty(entityKey)) continue;

      const validationResult = this.validationSchema.validate(entityKey, entityValue);

      if(validationResult.isError) return validationResult;
    }

    return ValidationResult.ok();
  }

  private validateSearchValue = (searchValue: string): ValidationResult => {
    if(!searchValue) return ValidationResult.ok();

    const containOnlyAlphanumeric = /[a-zA-Z0-9]/.test(searchValue);

    if(!containOnlyAlphanumeric) {
      return ValidationResult.error("The search value must be a string");
    }

    return ValidationResult.ok();
  }
}
