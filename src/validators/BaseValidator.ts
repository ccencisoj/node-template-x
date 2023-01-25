import { ValidationResult } from "../common/ValidationResult";

export class BaseValidator {
  public static validateId = (value: string): ValidationResult => {
    return ValidationResult.ok();
  }

  public static validateDate = (value: string): ValidationResult => {
    return ValidationResult.ok();
  }

  public static validateBoolean = (value: boolean): ValidationResult => {
    return ValidationResult.ok();
  }
}
