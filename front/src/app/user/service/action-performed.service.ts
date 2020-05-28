import {Injectable} from '@angular/core';
import {User} from '../../model/User';

@Injectable({
  providedIn: 'root'
})
export class ActionPerformedService {

  private actionPerformed: string;
  private user: User;

  constructor() {
  }

  enabledModificationMode(user: User) {
    this.actionPerformed = 'Modify';
    this.user = user;
  }

  enabledAddMode() {
    this.actionPerformed = 'Add';
  }

  getAction() {
    return this.actionPerformed;
  }

  getUser() {
    return this.user;
  }
}
