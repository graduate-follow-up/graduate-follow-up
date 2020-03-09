import { Injectable } from '@angular/core';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  isConnected = false;

  constructor(private router: Router) {
    this.isConnected = this.getConnection();
  }


  getConnection() {
    return (sessionStorage.getItem('connection') !== null); }

  stockConnection(login: string) {
    this.isConnected = true;
    sessionStorage.setItem('connection', login);
  }

  logout() {
    sessionStorage.removeItem('connection');
    this.isConnected = false;
    this.router.navigate(['login']);
  }

  getToken() {
    return sessionStorage.getItem('connection');
  }
}
