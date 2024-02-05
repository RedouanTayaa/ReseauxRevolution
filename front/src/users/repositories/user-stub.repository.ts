import { UserRepository } from './user.repository';
import { Observable } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { RegisterModel } from '../models/register.model';
import { UserModel } from '../models/user.model';
import { StripeModel } from '@users/models/stripe.model';

export class UserStubRepository implements UserRepository {
  login(params: {email: string, password: string}): Observable<LoginModel> {
    return new Observable(subscriber => {
      subscriber.next({token: '12345'});
    });
  }

  register(params: {email: string, password: string}): Observable<RegisterModel> {
    return new Observable(subscriber => {
      subscriber.next({username: params.email});
    });
  }

  getUserProfile(): Observable<UserModel> {
    return new Observable(subscriber => {
      subscriber.next({id: '1', username: 'username', email: 'username@test.fr'});
    });
  }

  forgetPassword(params: {username: string}): Observable<void> {
    return new Observable(subscriber => {
      subscriber.next();
    });
  }

  getStripeLink(): Observable<StripeModel> {
    return new Observable(subscriber => {
      subscriber.next({link: 'https://billing.stripe.com'});
    });
  }
}
