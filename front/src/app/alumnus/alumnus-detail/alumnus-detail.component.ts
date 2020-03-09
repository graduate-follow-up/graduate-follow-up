import {Component, Input, OnInit} from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {AlumnusService} from '../service/alumnus.service';
import {DataUserService} from '../../service/dataUser.service';
import {ConnectionService} from '../../login/services/connection.service';
import {ActionPerformedService} from '../service/actionPerformed.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-alumnus-detail',
  templateUrl: './alumnus-detail.component.html',
  styleUrls: ['./alumnus-detail.component.css']
})
export class AlumnusDetailComponent implements OnInit {

  @Input() alumnus: Alumnus;

  constructor(
    private alumnusService: AlumnusService,
    private connectionService: ConnectionService,
    private actionPerformed: ActionPerformedService,
    private router: Router
) {
  }

  ngOnInit() {
  }

  isAuthorized(al: Alumnus) {
    // User is allowed to see alumnus only if token equals to option or 'admin'
    return ((al.option === this.connectionService.getToken()) || (this.connectionService.getToken() === 'admin'));
  }

  checkAuthorize(alumnus: Alumnus) {
    return ((alumnus.name === this.connectionService.getToken()) || this.isAuthorized(alumnus));
  }

  modifyAlumnus(id: number) {
    this.actionPerformed.enabledModificationMode(id);
    this.router.navigate(['admin/edit']);
  }
}
