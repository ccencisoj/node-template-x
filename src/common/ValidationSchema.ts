import { ValidationResult } from "../../common/ValidationResult";

type Schema<Entity> = {
  [key in keyof Entity]: {
    type: any;
    unique: boolean;
    required: boolean;
    validate: ((value: string)=> ValidationResult);
  }
} & {
  [key: string]: {
    type: any;
    unique: boolean;
    required: boolean;
    validate: ((value: string)=> ValidationResult);
  }
}

export class ValidationSchema<Entity> {
  public readonly schema: Schema<Entity>;

  constructor(schema: Schema<Entity>) {
    this.schema = schema;
  }

  public containProperty = (propertyName: string): boolean => {
    return propertyName in this.schema;
  }

  public containUniqueProperty = (propertyName: string): boolean=> {
    return propertyName in this.schema && this.schema[propertyName].unique;
  }

  public containRequiredProperty = (propertyName: string): boolean => {
    return propertyName in this.schema && this.schema[propertyName].required;
  }

  public validate = (propertyName: string, value: string): ValidationResult => {
    return this.schema[propertyName].validate(value);
  }
}
