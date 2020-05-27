import { Component, OnInit } from '@angular/core';
import {ActionPerformedService} from '../service/actionPerformed.service';
import {Alumnus} from '../../model/Alumnus';

@Component({
  selector: 'app-alumnus-informations',
  templateUrl: './alumnus-informations.component.html',
  styleUrls: ['./alumnus-informations.component.css']
})
export class AlumnusInformationsComponent implements OnInit {

  public alumnus: Alumnus;

  constructor(private actionPerformed: ActionPerformedService) { }

  ngOnInit() {
    this.alumnus =  this.actionPerformed.getAlumnus();
  }

}
