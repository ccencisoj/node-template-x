import { User } from "../entities/User";

export class UserMapper {
  public static toJSON = (user: User)=> {
    return {...user, password: null};
  }
}
