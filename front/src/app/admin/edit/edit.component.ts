import {Component, OnInit} from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {ActivatedRoute, Router} from '@angular/router';
import {AlumnusService} from '../../alumnus/service/alumnus.service';
import {FormBuilder} from '@angular/forms';
import {ActionPerformedService} from '../../alumnus/service/actionPerformed.service';
import {DataOptionService} from '../../service/dataOption.service';

@Component({
  selector: 'app-alumnus-modify',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  action: string;
  options: string[];
  checkoutForm;
  idAlumnus: number;

  ngOnInit() {
    this.options = this.dataOptionService.getOptions();
    this.action = this.actionPerformed.getAction();

    if (this.action === 'Modify') {

      const alumnusToModify: Alumnus = this.alumnusService.findOne(this.actionPerformed.getAlumnusId());
      this.idAlumnus = alumnusToModify.id;

      this.checkoutForm = this.formBuilder.group({
        id: alumnusToModify._id,
        name: alumnusToModify.first_name + alumnusToModify.last_name,
        promotion: alumnusToModify.graduation,
        option: alumnusToModify.option,
        pays: alumnusToModify.country,
        entreprise: alumnusToModify.company,
        salaire: alumnusToModify.wage
      });
    } else {

      this.idAlumnus = this.alumnusService.generateId();

      this.checkoutForm = this.formBuilder.group({
        id: this.idAlumnus,
        name: '',
        promotion: '',
        option: '',
        pays: '',
        entreprise: '',
        salaire: ''
      });
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alumnusService: AlumnusService,
    private router: Router,
    private formBuilder: FormBuilder,
    private actionPerformed: ActionPerformedService,
    private dataOptionService: DataOptionService
  ) {
  }


  onclickSubmit(formData) {

    // Add Alumnus Id to data
    formData.id = this.idAlumnus;

    // Test if it is Modify or Add Mode
    if (this.action === 'Modify') {
      this.alumnusService.modify(formData);
      this.router.navigate(['']);
    } else {
      this.alumnusService.add(formData);
      this.router.navigate(['']);
    }
  }
}

