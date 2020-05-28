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
import {from, Observable, of} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import {ServerService} from '../service/server.service';


@Injectable()

export class TokenInterceptor implements HttpInterceptor {
  constructor(public toasterService: ToastrService, public connection: ConnectionService, public serverService: ServerService) {}

  async handleRequestHeader(request: HttpRequest<any>, next: HttpHandler) {
     if (this.connection.isConnected && this.connection.isTokenExpired() && request.url !== this.serverService.urlRefresh ) {
       await this.connection.refreshToken();
     }
     request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.connection.getAccessToken()}`
      }
    });
     return next.handle(request).pipe(
      tap(event => {}),
      catchError((err: any) => {
        this.toasterService.error(err.error, err.error.title, { positionClass: 'toast-top-center' });
        return of(err);
      })).toPromise();
  }

   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleRequestHeader(request, next));
  }
}
