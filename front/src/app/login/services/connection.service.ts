import { Injectable } from '@angular/core';
import {Token} from '../../model/Token';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  isConnected = false;

  constructor() {
    this.isConnected = this.getConnection();
  }

  getConnection() {
    return (localStorage.getItem('accessToken') !== null); }

  stockConnection(token: Token) {
    console.log('role= ' + localStorage.getItem('role'));
    const decoded = this.getDecodedAccessToken(token.accessToken);
    localStorage.setItem('accessToken', token.accessToken);
    localStorage.setItem('refreshToken', token.refreshToken);
    localStorage.setItem('role', decoded.role);
    localStorage.setItem('id', decoded.id);
    localStorage.setItem('username', decoded.username);
    this.isConnected = true;
  }

  logout() {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    this.isConnected = false;
  }

  getUserRole() {
    return localStorage.getItem('role');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
