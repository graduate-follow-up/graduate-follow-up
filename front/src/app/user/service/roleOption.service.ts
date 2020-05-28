import { Injectable } from '@angular/core';
import {MockRole} from '../../Database/mock-role';

@Injectable({
  providedIn: 'root'
})
export class RoleOptionService {

  constructor() { }
  getRoles(): string[] {
    return MockRole;
  }
}
