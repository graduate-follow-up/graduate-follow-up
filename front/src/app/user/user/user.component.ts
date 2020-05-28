import { Component, OnInit } from '@angular/core';
import {UserService} from '../service/user.service';
import {ConnectionService} from '../../login/services/connection.service';
import {Router} from '@angular/router';
import {RoleOptionService} from '../service/roleOption.service';
import {ErrorService} from '../../service/error.service';
import {ActionPerformedService} from '../service/action-performed.service';
import {User} from '../../model/User';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  users: User[];
  searchValue;
  errorMsg: string;
  optionValue;
  options: string[];

  constructor(
    private userService: UserService,
    private connectionService: ConnectionService,
    private router: Router,
    private actionPerformed: ActionPerformedService,
    private errorService: ErrorService,
    private roleOption: RoleOptionService
  ) {
  }


  ngOnInit() {
    this.userService.getUserObservable().subscribe(
      res => {this.users = res ; },
      error => this.errorMsg = this.errorService.getErrorMessage());
    this.options = this.roleOption.getRoles();
  }

  // Checks if user is authorized to add an alumni
  isAuthorized() {
    return (this.connectionService.getUserRole() === 'administrateur');
  }

  addUser() {
    this.actionPerformed.enabledAddMode();
    this.router.navigate(['/users/edit']).catch(err => this.errorMsg = err);
  }
}

