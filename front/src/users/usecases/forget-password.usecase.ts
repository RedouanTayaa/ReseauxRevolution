import { Observable } from 'rxjs';
import { UseCase } from '@base/use-case';
import { UserRepository } from '../repositories/user.repository';

export type ForgetPasswordCommand = {
  username: string,
}
export class UserForgetPasswordUseCase implements UseCase<ForgetPasswordCommand, void> {
  constructor(private userRepository: UserRepository) { }
  execute(
    params: ForgetPasswordCommand,
  ): Observable<void> {
    return this.userRepository.forgetPassword(params);
  }
}
