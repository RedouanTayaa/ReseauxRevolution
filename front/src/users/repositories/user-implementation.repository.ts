import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserEntity } from '../entities/user-entity';
import { UserMapper } from '../mappers/user.mapper';
import { UserModel } from '../models/user.model';
import { LoginModel } from '../models/login.model';
import { UserRepository } from './user.repository';
import { RegisterModel } from '../models/register.model';
import { environment } from '@environment/environment';
import { ApiResponse } from '@core/types';
import { RegisterCommand } from '@users/usecases/register.usecase';
import { LoginCommand } from '@users/usecases/login.usecase';
import { StripeModel } from '@users/models/stripe.model';

@Injectable({
  providedIn: 'root',
})
export class UserImplementationRepository implements UserRepository {
  userMapper = new UserMapper();
  constructor(private http: HttpClient) {}

  login(params: LoginCommand): Observable<LoginModel> {
    return this.http
      .post<LoginModel>(environment.apiUrl + '/login_check', {...params}).pipe(
        map((response: LoginModel) => {
          if (response.token === undefined) {
            throw new Error('Données non disponibles');
          }
          return response;
        }),
        catchError((err) => {
          throw new Error(err.error?.message);
        })
      );
  }

  register(params: RegisterCommand): Observable<RegisterModel> {
    return this.http
      .post<ApiResponse<RegisterModel>>(environment.apiUrl + '/register', {email: params.email, password: params.password}).pipe(
        map((response: ApiResponse<RegisterModel>) => {
          if (response.data === undefined || !response.success) {
            throw new Error('Données non disponibles');
          }
          return response.data;
        }),
        catchError((err) => {
          throw new Error(err.error?.message);
        })
      );
  }

  getUserProfile(): Observable<UserModel> {
    return this.http.get<ApiResponse<UserEntity>>(environment.apiUrl + '/user').pipe(
      map((response: ApiResponse<UserEntity>) => {
        if (response.data === undefined) {
          throw new Error('Données non disponibles');
        }
        return response.data;
      }),
      map(this.userMapper.mapFrom),
      catchError((err) => {
        throw new Error(err.error?.message);
      })
    );
  }

  forgetPassword(params: {username: string}): Observable<void> {
    return this.http.post<ApiResponse<void>>(environment.apiUrl + '/forgetpassword', {...params}).pipe(
      map((response: ApiResponse<void>) => {
        if (response.data === undefined) {
          throw new Error('Données non disponibles');
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(err.error?.message);
      })
    );
  }

  getStripeLink(): Observable<StripeModel> {
    return this.http.get<ApiResponse<StripeModel>>(environment.apiUrl + '/stripe').pipe(
      map((response: ApiResponse<StripeModel>) => {
        if (response.data === undefined) {
          throw new Error('Données non disponibles');
        }
        return response.data;
      }),
      catchError((err) => {
        throw new Error(err.error?.message);
      })
    );
  }
}
