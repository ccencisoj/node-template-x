import { ApplicationException } from "./ApplicationException";

export class ValidationException extends ApplicationException {
  constructor(message: string) {
    super("ValidationException", 400, message);
  }
}
