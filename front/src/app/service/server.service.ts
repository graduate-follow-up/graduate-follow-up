import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Token} from '../model/Token';
import {catchError} from 'rxjs/operators';
import {ErrorService} from './error.service';
import {AccessToken} from '../model/AccessToken';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor( private http: HttpClient) { }

  private urlConnect = 'http://proxy/connexion/login';
  private urlDeconnect = 'http://proxy/connexion/logout';
  public urlRefresh = 'http://proxy/connexion/token';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };


  connect(login: string, pswd: string): Observable<Token> {
    const body = {
      user: login ,
      password: pswd
    };
    return this.http.post<Token>( this.urlConnect, JSON.stringify(body), this.httpOptions);
      // .pipe(catchError(ErrorService.handleError));
  }

  disconnect(refreshToken: string): Observable<string> {
    const body2 = {
      "token" : refreshToken
    };
    return this.http.post<string>(this.urlDeconnect, JSON.stringify(body2), this.httpOptions)
      .pipe(catchError(ErrorService.handleError));
  }

  refresh(token: string): Observable<AccessToken> {
    const body3 = {
      "token": token
    };
    return this.http.post<AccessToken>(this.urlRefresh, JSON.stringify(body3), this.httpOptions)
      .pipe(catchError(ErrorService.handleError));
  }



}
