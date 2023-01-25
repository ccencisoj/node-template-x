import { ApplicationException } from "./ApplicationException";

export class AlreadyExistsException extends ApplicationException {
  constructor(message: string) {
    super("AlreadyExistsException", 400, message);
  }
}
