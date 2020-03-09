import { Injectable } from '@angular/core';
import {DataUserService} from './dataUser.service';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private dataUser: DataUserService) { }

  connect(login: string, password: string) {
    const user = this.dataUser.getUser(login);

    return ((user !== undefined) && (user.password === password));
  }
}
