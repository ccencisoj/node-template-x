import { ApplicationException } from "./ApplicationException";

export class NoFoundException extends ApplicationException {
  constructor(message: string) {
    super("NoFoundException", 400, message);
  }
}
