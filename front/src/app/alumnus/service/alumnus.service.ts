import {Injectable, OnInit} from '@angular/core';
import {Alumnus} from '../../model/Alumnus';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlumnusWithoutId} from '../../model/alumnus-without-id';

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


  private static handleError(error: HttpErrorResponse) {
    console.log('genre ya pas d\'erreur la ?' + error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getAlumnusObservable(): Observable<Alumnus[]> {
    return this.http.get<Alumnus[]>(this.ulrAlumnus)
      .pipe(catchError(AlumnusService.handleError)
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
    this.http.post<string>(this.ulrAlumnus, newAlumnus, this.httpOptions)
      .pipe(catchError(AlumnusService.handleError))
     /* .subscribe({
      next: data => console.log('data id = ' + data),
      error: error => console.error('There was an error!', error)
    })*/
     /* .pipe(catchError(this.handleError)
      )*/;
    console.log(newAlumnus);

  }

  /*delete(id: number) {
    const index: number = this.getAlumnus().findIndex(e => e._id === id);
    this.getAlumnus().splice(index, 1);
  }*/

  update(id: string, alumnus: AlumnusWithoutId) {
    return this.http.put(this.ulrAlumnus + '/' + id, alumnus, this.httpOptions)
      .pipe(catchError(AlumnusService.handleError));
  }

}
