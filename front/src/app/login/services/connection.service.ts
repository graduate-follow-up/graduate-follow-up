import { Injectable } from '@angular/core';
import {Token} from '../../model/Token';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import {HttpRequest} from '@angular/common/http';
import { ServerService } from '../../service/server.service';
import {AccessToken} from '../../model/AccessToken';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  isConnected = false;
  isAdministrator = false;

  constructor(private serverService: ServerService) {
    this.isConnected = this.isLoggedIn();
    this.isAdministrator = this.isAdmin();
  }
  isAdmin() {
    return localStorage.getItem('role') === 'administrateur';
  }

  async refreshToken() {
    const refreshToken = this.getRefreshToken();
    this.serverService.refresh(refreshToken).subscribe(
      accessToken => {
        this.stockConnection(new Token(refreshToken, accessToken.accessToken));
      },
      error => {
        console.log('connection.service error: ' + error);
      }
    );
  }

  getExpiration() {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return moment(expiresAt);
  }

  isTokenExpired() {
    return moment().isAfter(this.getExpiration()) ;
  }

  isLoggedIn() {
    return (localStorage.getItem('accessToken') !== null && this.isConnected);
  }

  stockConnection(token: Token) {
    localStorage.setItem('refreshToken', token.refreshToken);
    this.useToken(token);
  }

  logout() {
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('expires_at');
    this.isConnected = false;
    this.isAdministrator = false;
  }

  getUserRole() {
    return localStorage.getItem('role');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  useToken(token: AccessToken) {
    localStorage.setItem('accessToken', token.accessToken);

    const decoded = this.getDecodedAccessToken(token.accessToken);
    const expiresAt = moment().add(decoded.expiration.expiresIn, 'minutes');
    localStorage.setItem('role', decoded.role);
    localStorage.setItem('id', decoded.id);
    localStorage.setItem('username', decoded.username);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()) );
    this.isConnected = true;
    this.isAdministrator = (decoded.role === 'administrateur');
  }
}
