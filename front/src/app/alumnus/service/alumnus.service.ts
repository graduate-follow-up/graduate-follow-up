import {Injectable, OnInit} from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {AlumnusWithoutId} from '../../model/alumnus-without-id';
import {ErrorService} from '../../service/error.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnusService {

  constructor(private http: HttpClient) {}

  private ulrAlumnus = 'http://localhost/alumnis/';
  private alumnusData: Alumnus[];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})};

 /* findOne(alumnusId: number): Alumnus {
    return this.getAlumnus().find(e => e._id === alumnusId);
  }*/




  getAlumnusObservable(): Observable<Alumnus[]> {
    return this.http.get<Alumnus[]>(this.ulrAlumnus)
      .pipe(catchError(ErrorService.handleError)
      );
  }

  /*getAlumnusFillData(): void {
    this.getAlumnusObservable().subscribe(alumnus => {
      console.log(alumnus);
      this.alumnusData = alumnus;
    });
    console.log(this.alumnusData);
  }*/

  getAlumnus(): Alumnus[] {
    return this.alumnusData; }

 /* getAlumnusIndex(id: number): number {
    return this.getAlumnus().findIndex(e => e._id === id); }

  generateId(): number {
    return this.getAlumnus().reduce(((acc, val) => (val._id > acc) ? val._id : acc), 0) + 1; }
*/
  add(newAlumnus: AlumnusWithoutId) { // Insert in Database
    return this.http.post(this.ulrAlumnus, newAlumnus, this.httpOptions)
      .pipe(catchError(ErrorService.handleError));
  }

  /*delete(id: number) {
    const index: number = this.getAlumnus().findIndex(e => e._id === id);
    this.getAlumnus().splice(index, 1);
  }*/

  update(id: string, alumnus: AlumnusWithoutId) {
    return this.http.put(this.ulrAlumnus + id, alumnus, this.httpOptions)
      .pipe(catchError(ErrorService.handleError));
  }

  delete(id: string) {
    return this.http.delete(this.ulrAlumnus + id, this.httpOptions)
      .pipe(catchError(ErrorService.handleError));
  }
}
