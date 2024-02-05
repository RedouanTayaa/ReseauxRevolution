import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, of, retryWhen, take, throwError } from 'rxjs';
import { concatMap, delay, retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HttpRetryInterceptor implements HttpInterceptor {
  private readonly maxRetryAttempts = 3;
  private readonly retryDelay = 1500;

  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retryWhen(error =>
        error.pipe(
          concatMap((error, count) => {
            if (count <= 2 && error.status == 500) {
              return of(error);
            }

            if (error.status === 401) {
              this.authService.removeToken();
              this.router.navigate(['/user/login']);
            }
            return throwError(() => error);
          }),
          delay(1000)
        )
      )
    ) as Observable<HttpEvent<any>>;
  }
}
