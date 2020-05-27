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
import {Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';



@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor(public toasterService: ToastrService, public connection: ConnectionService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.connection.getAccessToken()}`
      }
    });
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('typeof event : ', typeof (event));
          console.log('event= ', event);
        }
      }),
      catchError((err: any) => {
        let msg = err.error;
        if (err.error === 'invalid token') { msg = 'Token has been refreshed, please retry'; }
        this.toasterService.error(msg, err.error.title, { positionClass: 'toast-top-center' });
        console.log('interceptor err' , err);
        console.log('req url :: ' , request.url);
        if (this.connection.isTokenExpired()) {
          console.log(`YOU GOT IT ${err}`);
          this.connection.refreshToken();
        }
        return of(err);
      }
  ));

    /*map((event: HttpEvent<any>) => {
        if (event instanceof HttpErrorResponse) {
          console.log('interceptor err' + err);
          console.log('req url :: ' + request.url);
          if (err.status === 401 && this.connection.isTokenExpired()) {
            console.log(`YOU GOT IT ${err}`);
            this.connection.refreshToken();
          }
        }
      }
    ));*/
  }

}
