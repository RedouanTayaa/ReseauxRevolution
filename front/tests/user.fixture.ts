import { UserStubRepository } from '@users/repositories/user-stub.repository';
import { LoginCommand, UserLoginUseCase } from '@users/usecases/login.usecase';
import { LoginModel } from '@users/models/login.model';
import { RegisterCommand, UserRegisterUseCase } from '@users/usecases/register.usecase';
import { RegisterModel } from '@users/models/register.model';

export const createUserFixture = () => {
  const userRepository = new UserStubRepository();
  const loginUseCase = new UserLoginUseCase(userRepository);
  const registerUseCase = new UserRegisterUseCase(userRepository);
  let login: LoginModel;
  let registerResult: RegisterModel

  return {
    whenUserLogin(loginCommand: LoginCommand) {
      loginUseCase.execute(loginCommand).subscribe(user => {
        login = user;
      });
    },
    whenUserRegister(registerCommand: RegisterCommand) {
      registerUseCase.execute(registerCommand).subscribe(register => {
        registerResult = register;
      });
    },
    thenShouldGetToken(expectResult: LoginModel) {
      expect(login).toEqual(expectResult);
    },
    thenShouldRegisterSuccess(expectResult: RegisterModel) {
      expect(registerResult).toEqual(expectResult);
    }
  }
}

export type UserFixture = ReturnType<typeof createUserFixture>;
