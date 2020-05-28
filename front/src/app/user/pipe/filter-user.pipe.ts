import { Pipe, PipeTransform } from '@angular/core';
import {User} from '../../model/User';

@Pipe({
  name: 'filterUser'
})
export class FilterUserPipe implements PipeTransform {

  transform(usersArray: User[], searchValue: string, optionValue: string): User[] {

    if (optionValue && (optionValue !== 'all')) {
      usersArray = usersArray.filter(e => e.role.includes(optionValue));
    }

    if (searchValue) {
      searchValue = searchValue.toLowerCase();
      usersArray = usersArray.filter(e => e.name.firstName.toLowerCase().includes(searchValue)
        || e.name.lastName.toLowerCase().includes(searchValue) || e.login.toLowerCase().includes(searchValue.toLowerCase())); }

    return usersArray;
  }

}
