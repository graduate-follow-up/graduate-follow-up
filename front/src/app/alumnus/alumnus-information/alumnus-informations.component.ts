import { Component, OnInit } from '@angular/core';
import {ActionPerformedService} from '../service/actionPerformed.service';
import {Alumnus} from '../../model/Alumnus';
import {AlumnusService} from '../service/alumnus.service';

@Component({
  selector: 'app-alumnus-informations',
  templateUrl: './alumnus-informations.component.html',
  styleUrls: ['./alumnus-informations.component.css']
})
export class AlumnusInformationsComponent implements OnInit {

  public alumnus: Alumnus;
  public scrappingResult: any;

  constructor(private actionPerformed: ActionPerformedService,
              private alumniService: AlumnusService) { }

  ngOnInit() {
    this.alumnus =  this.actionPerformed.getAlumnus();

    this.alumniService.getAlumnusScrappingObservable(this.alumnus.first_name + ' ' + this.alumnus.last_name).subscribe(
      object => {
        object.forEach(obj => {
        if (obj.entreprise) {
          this.scrappingResult = 'Entreprise : ' + obj.entreprise + ', ';
        }

        if (obj.location) {
          this.scrappingResult = 'Location : ' + obj.location + ', ';
        }

        if (obj.periode) {
            this.scrappingResult = 'Periode : ' + obj.periode + ', ';
          }

        if (obj.poste) {
          this.scrappingResult = 'Poste : ' + obj.poste;
        }

        console.log(obj); }); }
    );
  }

  sendUpdateMailToAlumnus(id: string) {
    console.log('Sending mail...');
    this.alumniService.updateMail(id);
  }
}
