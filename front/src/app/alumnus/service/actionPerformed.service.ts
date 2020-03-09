import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionPerformedService {

  private actionPerformed: string;
  private alumnusId: number;

  constructor() {
  }

  enabledModificationMode(id: number) {
    this.actionPerformed = 'Modify';
    this.alumnusId = id;
  }

  enabledAddMode() {
    this.actionPerformed = 'Add';
  }

  getAction() {
    return this.actionPerformed;
  }

  getAlumnusId() {
    return this.alumnusId;
  }
}
