import { Observable } from 'rxjs';
import { UserModel } from '../models/user.model';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { RegisterCommand } from '@users/usecases/register.usecase';
import { LoginCommand } from '@users/usecases/login.usecase';
import { ForgetPasswordCommand } from '@users/usecases/forget-password.usecase';
import { StripeModel } from '@users/models/stripe.model';

export abstract class UserRepository {
  abstract login(params: LoginCommand): Observable<LoginModel>;
  abstract register(params: RegisterCommand): Observable<RegisterModel>;
  abstract getUserProfile(): Observable<UserModel>;
  abstract forgetPassword(params: ForgetPasswordCommand): Observable<void>;
  abstract getStripeLink(): Observable<StripeModel>
}
