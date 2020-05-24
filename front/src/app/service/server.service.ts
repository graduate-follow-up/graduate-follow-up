import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Token} from '../model/Token';
import {catchError} from 'rxjs/operators';
import {ErrorService} from './error.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor( private http: HttpClient ) { }
  private ulrServiceConnexion = 'http://localhost/connexion/login/';
  private  urlServiceDeconnexion = 'http://localhost/connexion/logout/';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };

  connect(login: string, pswd: string): Observable<Token> {
    const body = {
      user: login ,
      password: pswd
    };
    return this.http.post<Token>(this.ulrServiceConnexion, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(ErrorService.handleError));
  }

  disconnect(refreshToken: string): Observable<string> {
  const body2 = {
    "token": refreshToken
  };
  return this.http.post<string>(this.urlServiceDeconnexion, JSON.stringify(body2), this.httpOptions)
    .pipe(catchError(ErrorService.handleError));
  }

}
