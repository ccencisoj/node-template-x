import { BaseValidator } from "./BaseValidator";
import { ValidationResult } from "../common/ValidationResult";

export class UserValidator extends BaseValidator {
  public static validateEmail = (value: string): ValidationResult => {
    return ValidationResult.ok();
  }

  public static validatePassword = (value: string): ValidationResult => {
    return ValidationResult.ok();
  }
}
