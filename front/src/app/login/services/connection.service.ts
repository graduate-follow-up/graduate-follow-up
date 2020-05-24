import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {Token} from '../../model/Token';
import * as jwt_decode from 'jwt-decode';

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
    const decoded = this.getDecodedAccessToken(token.accessToken);
    sessionStorage.setItem('accessToken', token.accessToken);
    sessionStorage.setItem('refreshToken', token.refreshToken);
    sessionStorage.setItem('role', decoded.role);
    sessionStorage.setItem('id', decoded.id);
    sessionStorage.setItem('username', decoded.username);
    this.isConnected = true;

  }

  logout() {
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('username');
    this.isConnected = false;
  }

  getAccessToken() {
    return sessionStorage.getItem('accessToken');
  }

  getUserRole() {
    return sessionStorage.getItem('role');
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
