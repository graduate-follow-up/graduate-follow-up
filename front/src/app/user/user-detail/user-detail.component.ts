import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {User} from '../../model/User';
import {UserService} from '../service/user.service';
import {ConnectionService} from '../../login/services/connection.service';
import {ActionPerformedService} from '../service/action-performed.service';
import {Router} from '@angular/router';
import {ErrorService} from '../../service/error.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  @Input() user: User;
  errorMsg: string;

  constructor(
    public userService: UserService,
    private connectionService: ConnectionService,
    private actionPerformed: ActionPerformedService,
    private router: Router,
    private errorService: ErrorService,
) {}

  ngOnInit() {
  }

  isAuthorized() {
    return (this.connectionService.getUserRole() === 'administrateur');
  }

  checkAuthorize() {
    return (this.connectionService.getUserRole() === 'administrateur')
  }

  modifyUser(user: User) {
    this.actionPerformed.enabledModificationMode(user);
    this.router.navigate(['users/edit']).catch(err => this.errorMsg = err);
  }

  delete(id: string) {
    this.userService.delete(id).subscribe(
      data => this.refresh(),
      error => this.errorMsg = this.errorService.getErrorMessage()
    );
  }

  goToInformation(user: User) {
    this.actionPerformed.enabledModificationMode(user);
    this.router.navigate(['users/information']).catch(err => this.errorMsg = err);
  }


  refresh() {
    // tslint:disable-next-line:max-line-length
    this.router.navigateByUrl('/users/edit', { skipLocationChange: true }).then(() => {this.router.navigate(['']).catch(err => this.errorMsg = err); });
  }
}
