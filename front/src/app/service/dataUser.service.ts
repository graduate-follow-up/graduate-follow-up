import {Injectable} from '@angular/core';
import {MockUser} from '../Database/mock-user';
import {User} from '../model/User';

@Injectable({
  providedIn: 'root'
})
export class DataUserService {

  constructor() {
  }

  getAllUser(): User[] {
    return MockUser;
  }

  getUser(login: string): User {
    return this.getAllUser().find(e => e.login === login); }

 /* checkAdminLogged() {
    return (localStorage.getItem('login') === 'admin');
  }

  isconnect() {
    const login = localStorage.getItem('login');
    return  ((login !== undefined) && (login !== null));
  }

  checkConnect(login: string, password: string): boolean {

    const user: User = this.getUser().find(e => e.login === login);
    const loginAccepted: boolean = ((user !== undefined) && (user.password === password));

    if (loginAccepted) {
      localStorage.setItem('login', user.login);
    }
    return loginAccepted;
  }
*/
}
