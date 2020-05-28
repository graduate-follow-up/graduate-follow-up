import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Alumnus} from '../../model/Alumnus';
import {AlumnusService} from '../service/alumnus.service';
import {DataOptionService} from '../../service/dataOption.service';
import {FormBuilder} from '@angular/forms';
import {ErrorService} from '../../service/error.service';
import {ConnectionService} from '../../login/services/connection.service';


@Component({
  selector: 'app-alumnus-edit-by-url',
  templateUrl: './alumnus-edit-by-url.component.html',
  styleUrls: ['./alumnus-edit-by-url.component.css']
})
export class AlumnusEditByUrlComponent implements OnInit {

  public alumnus: Alumnus;
  public alumnusId;
  public allAlumnus: Alumnus[];
  public options: string[];
  public checkoutForm;
  public errorMsg: string;

  constructor(private route: ActivatedRoute,
              private alumniService: AlumnusService,
              private dataOptionService: DataOptionService,
              private connectionService: ConnectionService,
              private router: Router,
              private formBuilder: FormBuilder,
              private errorService: ErrorService
  ) {

  }

  ngOnInit() {

    this.options = this.dataOptionService.getOptions();


    this.route.params.subscribe(
      obj => {
        this.alumnusId = obj.id;
        this.alumniService.getOneAlumnus(obj.id).subscribe(
          al => {this.alumnus = al;
                 this.checkoutForm = this.formBuilder.group({
            first_name: this.alumnus.first_name,
            last_name : this.alumnus.last_name,
            email: this.alumnus.email,
            company: this.alumnus.company,
            job: this.alumnus.job,
            country: this.alumnus.country,
            city: this.alumnus.city,
            option: this.alumnus.option,
            campus: this.alumnus.campus,
            graduation: this.alumnus.graduation,
            wage: this.alumnus.wage,
            phone: this.alumnus.phone
          }); });
      }
    ); // .then( () => console.log('waaaaaaaaaaa' )
      /*this.alumniService.getAlumnusObservable().subscribe(
        al =>
*/

    /*this.alumnus = this.allAlumnus.find(al => (al._id === this.alumnusId));
    console.log(this.alumnusId + ' QUOIIIIIIi ' + this.alumnus);
    this.checkoutForm = this.formBuilder.group({
          first_name: this.alumnus.first_name,
          last_name : this.alumnus.last_name,
          email: this.alumnus.email,
          company: this.alumnus.company,
          job: this.alumnus.job,
          country: this.alumnus.country,
          city: this.alumnus.city,
          option: this.alumnus.option,
          campus: this.alumnus.campus,
          graduation: this.alumnus.graduation,
          wage: this.alumnus.wage,
          phone: this.alumnus.phone
        });*/



  }

  onclickSubmit(formData) {
    this.alumniService.update(this.alumnusId, formData).subscribe(
        data => {
          this.connectionService.logout();
          this.router.navigate(['']);
        },
        error => this.errorMsg = this.errorService.getErrorMessage()
      );
    }
}
