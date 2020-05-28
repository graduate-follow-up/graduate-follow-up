import {Component, OnInit} from '@angular/core';
import {User} from '../../model/User';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../service/user.service';
import {FormBuilder} from '@angular/forms';
import {ActionPerformedService} from '../service/action-performed.service';
import {RoleOptionService} from '../service/roleOption.service';
import {ErrorService} from '../../service/error.service';

@Component({
  selector: 'app-user-modify',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  action: string;
  options: string[];
  checkoutForm;
  idUser: string;
  errorMsg: string;
  isCreating: boolean;

  ngOnInit() {
    this.options = this.roleOptionService.getRoles();
    this.action = this.actionPerformed.getAction();
    this.isCreating = this.action !== 'Modify';
    if (this.action === 'Modify') {
      const userToModify: User = this.actionPerformed.getUser();
      this.idUser = userToModify._id;
      const tmpName = userToModify.name;

      this.checkoutForm = this.formBuilder.group({
        first_name : tmpName.firstName,
        last_name : tmpName.lastName,
        email: userToModify.email,
        login: userToModify.login,
        role : userToModify.role,
        password : ''
      });
    } else {
      this.checkoutForm = this.formBuilder.group({
        first_name: '',
        last_name: '' ,
        email: '',
        login: '',
        role: '',
        password: '',
      });
    }
  }

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private actionPerformed: ActionPerformedService,
    private roleOptionService: RoleOptionService,
    private errorService: ErrorService
  ) {
    this.isCreating = this.action !== 'Modify';
  }

  onclickSubmit(formData) {

    if (this.action === 'Modify') {
      this.userService.update(this.idUser, formData).subscribe(
        data => {this.router.navigate(['/user']).catch(e => this.errorMsg = e); },
        error => this.errorMsg = error + ' | ' + this.errorService.getErrorMessage()
      );
    } else {
      this.userService.add(formData).subscribe(
        data => {this.router.navigate(['/user']).catch(e => this.errorMsg = e); },
        error => this.errorMsg = error + ' | ' + this.errorService.getErrorMessage()
      );
    }
  }
}

