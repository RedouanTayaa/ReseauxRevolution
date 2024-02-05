import { Observable } from 'rxjs';
import { UseCase } from '@base/use-case';
import { UserRepository } from '../repositories/user.repository';
import { LoginModel } from '../models/login.model';

export type LoginCommand = {
  email: string,
  password: string
}

export class UserLoginUseCase implements UseCase<LoginCommand, LoginModel> {
  constructor(private userRepository: UserRepository) { }
  execute(
    params: LoginCommand,
  ): Observable<LoginModel> {
    return this.userRepository.login(params);
  }
}
