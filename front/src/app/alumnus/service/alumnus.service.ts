import {Injectable} from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlumnusService {

  private ulrAlumnus = 'https://127.0.0.1/alumnis/';
  private alumnusData: Alumnus[];

  constructor(private http: HttpClient) {}

  /*
  const httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin':'*',
    })
  };*/


  private getAlumnusObservable(): Observable<Alumnus[]> {
    return this.http.get<Alumnus[]>(this.ulrAlumnus);
  }

   getAlumnus(): Alumnus[] {
    this.getAlumnusObservable().subscribe(alumnus => this.alumnusData = alumnus);
    return this.alumnusData; }


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
