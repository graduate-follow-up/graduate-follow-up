import {Injectable} from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {MockAlumnus} from '../../Database/mock-alumnus';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnusService {

  private ulrAlumnus = 'localhost/alumnis';
  private alumnusData: Alumnus[];

<<<<<<< HEAD
  constructor(private http: HttpClient) {}

  private getAlumnusObservable(): Observable<Alumnus[]> {
    return this.http.get<Alumnus[]>(this.ulrAlumnus);
  }

   getAlumnus(): Alumnus[] {
    this.getAlumnusObservable().subscribe(alumnus => this.alumnusData = alumnus);
    return this.alumnusData; }
=======
 // private serviceAlumnus = 'api/heroes';

  getAlumnus(): Alumnus[] {
    //return this.httpClient.get('url...');
   return MockAlumnus; }
>>>>>>> 315fb0cdf9f1e2ecd2f3e299ce01388bdcbc8924

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
