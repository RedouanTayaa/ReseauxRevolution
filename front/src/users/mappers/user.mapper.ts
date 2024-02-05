import { UserModel } from '../models/user.model';
import { UserEntity } from '../entities/user-entity';
export class UserMapper {
  mapFrom(param: UserEntity): UserModel {
    return {
      id: param.id,
      username: param.username,
      email: param.email,
    };
  }

  mapTo(param: UserModel): UserEntity {
    return {
      id: param.id,
      username: param.username,
      email: param.email
    }
  }
}
