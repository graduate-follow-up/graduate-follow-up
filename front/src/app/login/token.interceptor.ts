import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { ConnectionService } from './services/connection.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable()

export class TokenInterceptor implements HttpInterceptor {

  constructor(public connection: ConnectionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.connection.getAccessToken()}`
      }
    });
    return next
      .handle(request)
      .pipe(tap(
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            console.log('interceptor err' + err);
            console.log('req url :: ' + request.url);
            if (err.status === 401 && this.connection.isTokenExpired()) {
              this.connection.refreshToken();
            }
          }
        }
      ));
  }

}
