import { ApplicationException } from "./ApplicationException";

export class RequiredException extends ApplicationException {
  constructor(message: string) {
    super("RequiredException", 400, message);
  }
}
