import { Component, OnInit } from '@angular/core';
import {AlumnusService} from '../service/alumnus.service';
import {ConnectionService} from '../../login/services/connection.service';
import {Router} from '@angular/router';
import {ActionPerformedService} from '../service/actionPerformed.service';
import {DataOptionService} from '../../service/dataOption.service';
import {ErrorService} from '../../service/error.service';

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
  errorMsg: string;

  constructor(
    private alumnusService: AlumnusService,
    private connectionService: ConnectionService,
    private router: Router,
    private actionPerformed: ActionPerformedService,
    private dataOption: DataOptionService,
    private errorService: ErrorService
  ) { }


  ngOnInit() {
    this.alumnusService.getAlumnusObservable().subscribe(
      alumnus => this.alumnus = alumnus,
      error => this.errorMsg = this.errorService.getErrorMessage());
    this.options = this.dataOption.getOptions();
  }

  // Checks if user is authorized to add an alumni
  isAuthorized() {
    return (this.connectionService.getUserRole() === 'administrateur' || this.connectionService.getUserRole() === 'respo-option' );
  }

  addAlumnus() {
    this.actionPerformed.enabledAddMode();
    this.router.navigate(['/alumnus/edit']).catch(err => this.errorMsg = err);
  }
}
