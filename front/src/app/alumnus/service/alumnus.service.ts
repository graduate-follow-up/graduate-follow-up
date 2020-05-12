import {Injectable} from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {MockAlumnus} from '../../Database/mock-alumnus';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlumnusService {

  constructor(private httpClient: HttpClient) {}

 // private serviceAlumnus = 'api/heroes';

  getAlumnus(): Alumnus[] {
    //return this.httpClient.get('url...');
   return MockAlumnus; }

  getAlumnusIndex(id: number): number {
    return this.getAlumnus().findIndex(e => e.id === id); }

  generateId(): number {
    return this.getAlumnus().reduce(((acc, val) => (val.id > acc) ? val.id : acc), 0) + 1; }

  add(newAlumnus: Alumnus) { // Insert in Database
    this.getAlumnus().push(newAlumnus); }

  delete(id: number) {
    const index: number = this.getAlumnus().findIndex(e => e.id === id);
    this.getAlumnus().splice(index, 1);
  }

  modify(alumnus: Alumnus) {
    this.delete(alumnus.id);
    this.add(alumnus);
  }

  findOne(alumnusId: number): Alumnus {
    return this.getAlumnus().find(e => e.id === alumnusId);
  }
}
