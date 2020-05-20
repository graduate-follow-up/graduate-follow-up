import { Pipe, PipeTransform } from '@angular/core';
import {Alumnus} from '../../model/Alumnus';

@Pipe({
  name: 'filterAlumnus'
})
export class FilterAlumnusPipe implements PipeTransform {

  transform(alumnusArray: Alumnus[], searchValue: string, optionValue: string): Alumnus[] {

    if (optionValue && (optionValue !== 'all')) {
      alumnusArray = alumnusArray.filter(e => e.option.includes(optionValue));
    }

    if (searchValue) {
      searchValue = searchValue.toLowerCase();
      alumnusArray = alumnusArray.filter(e => e.last_name.toLowerCase().includes(searchValue)
        || e.company.toLowerCase().includes(searchValue)); }

    return alumnusArray;
  }

}
