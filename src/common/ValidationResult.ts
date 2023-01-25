export class ValidationResult {
  public readonly error: string;
  public readonly isError: boolean;
  public readonly isSuccess: boolean;

  private constructor(error: string) {
    this.error = error;
    this.isError = !!(error) === true;
    this.isSuccess = !!(error) === false;
  }

  public static ok = ()=> {
    return new ValidationResult(null);
  }

  public static error = (error: string)=> {
    return new ValidationResult(error);
  }

  public static combine = (results: ValidationResult[])=> {

    for(let result of results) {
      if(result.isError) return result;
    }

    return ValidationResult.ok();
  }
}
