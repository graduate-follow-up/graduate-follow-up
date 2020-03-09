import { Injectable } from '@angular/core';
import {MockOption} from '../Database/mock-option';

@Injectable({
  providedIn: 'root'
})
export class DataOptionService {

  constructor() { }

  getOptions(): string[] {
    return MockOption;
  }
}
