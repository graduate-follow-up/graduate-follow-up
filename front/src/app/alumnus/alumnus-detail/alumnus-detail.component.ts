import {Component, Input, OnInit} from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {AlumnusService} from '../service/alumnus.service';
import {DataUserService} from '../../service/dataUser.service';
import {ConnectionService} from '../../login/services/connection.service';
import {ActionPerformedService} from '../service/actionPerformed.service';
import {Router} from '@angular/router';
import {ErrorService} from '../../service/error.service';

@Component({
  selector: 'app-alumnus-detail',
  templateUrl: './alumnus-detail.component.html',
  styleUrls: ['./alumnus-detail.component.css']
})
export class AlumnusDetailComponent implements OnInit {

  @Input() alumnus: Alumnus;
  errorMsg: string;

  constructor(
    public alumnusService: AlumnusService,
    private connectionService: ConnectionService,
    private actionPerformed: ActionPerformedService,
    private router: Router,
    private errorService: ErrorService
) {
  }

  ngOnInit() {
  }

  isAuthorized() {
    // User is allowed to delete alumnus only if role is respo-option or administrateur
    return (this.connectionService.getUserRole() === 'respo-option' || this.connectionService.getUserRole() === 'administrateur');
  }

  /* checkAuthorize(alumnus: Alumnus) {
    return ((alumnus._id === this.connectionService.getUserId()) || this.isAuthorized(alumnus));
  }*/

  // TODO : check if user == alumni -> ajouter nom et prénom au token ou ajouter endpoint au service alumni/user ?
  checkAuthorize() {
    return true;
  }

  modifyAlumnus(alumnus: Alumnus) {
    this.actionPerformed.enabledModificationMode(alumnus);
    this.router.navigate(['alumnus/edit']).catch(err => this.errorMsg = err);
  }

  delete(id: string) {
    this.alumnusService.delete(id).subscribe(
      // tslint:disable-next-line:max-line-length
      data => this.router.navigateByUrl('/admin/edit', { skipLocationChange: true }).then(() => {this.router.navigate(['']).catch(err => this.errorMsg = err); }),
      error => this.errorMsg = this.errorService.getErrorMessage()
    );
  }
}
