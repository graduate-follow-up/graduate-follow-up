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
      tap(event => {}),
      catchError((err: any) => {
        let msg = err.error;
        if (err.error === 'invalid token') { msg = 'Token has been refreshed, please retry'; }
        this.toasterService.error(msg, err.error.title, { positionClass: 'toast-top-center' });
        if (this.connection.isTokenExpired()) {
          this.connection.refreshToken();
        }
        return of(err);
      }
  ));
  }

}
