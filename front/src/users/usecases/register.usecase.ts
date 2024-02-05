import { Observable } from 'rxjs';
import { UseCase } from '@base/use-case';
import { UserRepository } from '../repositories/user.repository';
import { RegisterModel } from '../models/register.model';

export type RegisterCommand = {
  email: string,
  password: string
}
export class UserRegisterUseCase implements UseCase<RegisterCommand, RegisterModel> {
  constructor(private userRepository: UserRepository) { }
  execute(
    params: RegisterCommand,
  ): Observable<RegisterModel> {
    return this.userRepository.register(params);
  }
}
