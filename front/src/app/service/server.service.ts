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
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  };
  connect(login: string, password: string): Observable<Token> {
    const body = {
      user: login ,
      password: password
    };
    return this.http.post<Token>(this.ulrServiceConnexion, JSON.stringify(body), this.httpOptions)
      .pipe(catchError(ErrorService.handleError)
    );
  }
}
