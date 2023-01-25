import { IEntity } from "../common/IEntity";

export interface User extends IEntity {
  email: string;
  password: string;
}
