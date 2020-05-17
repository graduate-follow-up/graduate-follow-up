import {Injectable} from '@angular/core';
import {Alumnus} from "../../model/Alumnus";

@Injectable({
  providedIn: 'root'
})
export class ActionPerformedService {

  private actionPerformed: string;
  private alumnus: Alumnus;

  constructor() {
  }

  enabledModificationMode(alumnus: Alumnus) {
    this.actionPerformed = 'Modify';
    this.alumnus = alumnus;
  }

  enabledAddMode() {
    this.actionPerformed = 'Add';
  }

  getAction() {
    return this.actionPerformed;
  }

  getAlumnus() {
    return this.alumnus;
  }
}
