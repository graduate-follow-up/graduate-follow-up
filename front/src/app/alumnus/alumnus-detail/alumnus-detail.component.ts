import {Component, ElementRef, Input, OnInit} from '@angular/core';
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
  //alumnusToDelete = false;

  constructor(
    public alumnusService: AlumnusService,
    private connectionService: ConnectionService,
    private actionPerformed: ActionPerformedService,
    private router: Router,
    private errorService: ErrorService,
    private el: ElementRef
) {
  }

  ngOnInit() {
  }

  isAuthorized(al: Alumnus) {
    // User is allowed to see alumnus only if token equals to option or 'admin'
    return ((al.option === this.connectionService.getToken()) || (this.connectionService.getToken() === 'admin'));
  }

  checkAuthorize(alumnus: Alumnus) {
    return ((alumnus.first_name === this.connectionService.getToken()) || this.isAuthorized(alumnus));
  }

  modifyAlumnus(alumnus: Alumnus) {
    this.actionPerformed.enabledModificationMode(alumnus);
    this.router.navigate(['alumnus/edit']).catch(err => this.errorMsg = err);
  }

  delete(id: string) {
    this.alumnusService.delete(id).subscribe(
      data => this.refresh(),
      error => this.errorMsg = this.errorService.getErrorMessage()
    );
  }

  goToInformation(alumnus: Alumnus) {
    this.actionPerformed.enabledModificationMode(alumnus);
    this.router.navigate(['alumnus/information']).catch(err => this.errorMsg = err);

  /*deleteProcess(al: Alumnus) {
    this.alumnusToDelete = true;
  }*/

  refresh() {
    // tslint:disable-next-line:max-line-length
    this.router.navigateByUrl('/alumnus/edit', { skipLocationChange: true }).then(() => {this.router.navigate(['']).catch(err => this.errorMsg = err); });
  }
}
