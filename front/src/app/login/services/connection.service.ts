import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Token} from '../../model/Token';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  isConnected = false;

  constructor(private router: Router) {
    this.isConnected = this.getConnection();
  }

  getConnection() {
    return (sessionStorage.getItem('accessToken') !== null); }

  stockConnection(token: Token) {
    this.isConnected = true;
    sessionStorage.setItem('accessToken', token.accessToken);
    sessionStorage.setItem('refreshToken', token.refreshToken);
  }

  logout() {
    // TODO : invoke API logout method
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    this.isConnected = false;
    this.router.navigate(['login']);
  }

  getToken() {
    return sessionStorage.getItem('accessToken');
  }
}
