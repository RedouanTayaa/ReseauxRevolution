import { UserRepository } from '@users/repositories/user.repository';
import { UserLoginUseCase } from '@users/usecases/login.usecase';
import { UserRegisterUseCase } from '@users/usecases/register.usecase';
import { UserForgetPasswordUseCase } from '@users/usecases/forget-password.usecase';
import { UserStripeLinkUseCase } from '@users/usecases/stripe-link.usecase';

export const userLoginUseCaseFactory =
  (userRepo: UserRepository) => new UserLoginUseCase(userRepo);

export const userRegisterUseCaseFactory =
  (userRepo: UserRepository) => new UserRegisterUseCase(userRepo);

export const userForgetPasswordUseCaseFactory =
  (userRepo: UserRepository) => new UserForgetPasswordUseCase(userRepo);

export const userStripeLinkUseCaseFactory =
  (userRepo: UserRepository) => new UserStripeLinkUseCase(userRepo);
