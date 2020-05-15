import { Component, OnInit } from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {AlumnusService} from '../service/alumnus.service';
import {DataUserService} from '../../service/dataUser.service';
import {ConnectionService} from '../../login/services/connection.service';
import {Router} from '@angular/router';
import {ActionPerformedService} from '../service/actionPerformed.service';
import {DataOptionService} from '../../service/dataOption.service';

@Component({
  selector: 'app-alumnus',
  templateUrl: './alumnus.component.html',
  styleUrls: ['./alumnus.component.css']
})
export class AlumnusComponent implements OnInit {

  alumnus;
  searchValue;
  optionValue;
  options: string[];

  constructor(
    private alumnusService: AlumnusService,
    private connectionService: ConnectionService,
    private router: Router,
    private actionPerformed: ActionPerformedService,
    private dataOption: DataOptionService
  ) { }


  ngOnInit() {
    this.alumnusService.getAlumnusObservable().subscribe(alumnus => this.alumnus = alumnus);
    this.options = this.dataOption.getOptions();
  }

  isAuthorized() {
    return (this.connectionService.getToken() === 'admin');
  }

  addAlumnus() {
    this.actionPerformed.enabledAddMode();
    this.router.navigate(['/admin/edit']);
  }
}
