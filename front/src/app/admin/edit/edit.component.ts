import {Component, OnInit} from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {ActivatedRoute, Router} from '@angular/router';
import {AlumnusService} from '../../alumnus/service/alumnus.service';
import {FormBuilder} from '@angular/forms';
import {ActionPerformedService} from '../../alumnus/service/actionPerformed.service';
import {DataOptionService} from '../../service/dataOption.service';
import {Observable} from 'rxjs';
import {ErrorService} from '../../service/error.service';

@Component({
  selector: 'app-alumnus-modify',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  action: string;
  options: string[];
  checkoutForm;
  idAlumnus: string;
  errorMsg: string;

  ngOnInit() {
    this.options = this.dataOptionService.getOptions();
    this.action = this.actionPerformed.getAction();

    if (this.action === 'Modify') {

      const alumnusToModify: Alumnus = this.actionPerformed.getAlumnus();
      this.idAlumnus = alumnusToModify._id;

      this.checkoutForm = this.formBuilder.group({
        first_name: alumnusToModify.first_name,
        last_name : alumnusToModify.last_name,
        email: alumnusToModify.email,
        company: alumnusToModify.company,
        job: alumnusToModify.job,
        country: alumnusToModify.country,
        city: alumnusToModify.city,
        option: alumnusToModify.option,
        campus: alumnusToModify.campus,
        graduation: alumnusToModify.graduation,
        wage: alumnusToModify.wage,
        phone: alumnusToModify.phone
      });
    } else {

     // this.idAlumnus = this.alumnusService.generateId();

      this.checkoutForm = this.formBuilder.group({
        first_name: '',
        last_name : '',
        email: '',
        company: '',
        job: '',
        country: '',
        city: '',
        option: '',
        campus: '',
        graduation: '',
        wage: '',
        phone: ''
      });
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alumnusService: AlumnusService,
    private router: Router,
    private formBuilder: FormBuilder,
    private actionPerformed: ActionPerformedService,
    private dataOptionService: DataOptionService,
    private errorService: ErrorService
  ) {
  }


  onclickSubmit(formData) {

    // Add Alumnus Id to data
    // Test if it is Modify or Add Mode
    if (this.action === 'Modify') { // ICI METTRE LE SUBSCRIBE ET SI ERROR METTRE LE MESSAGE D4ERRUER ET BANCO
      // TODO
      this.alumnusService.update(this.idAlumnus, formData).subscribe(
        data => this.router.navigate(['']),
        error => this.errorMsg = this.errorService.getErrorMessage()
      );

    } else {
      this.alumnusService.add(formData).subscribe(
        data => this.router.navigate(['']),
        error => this.errorMsg = this.errorService.getErrorMessage()
      );
    }
  }
}

