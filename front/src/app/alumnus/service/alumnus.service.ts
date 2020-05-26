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
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  getAlumnusObservable(): Observable<Alumnus[]> {
    return this.http.get<Alumnus[]>(this.ulrAlumnus)
      .pipe(catchError(ErrorService.handleError)
      );
  }

  getAlumnus(): Alumnus[] {
    return this.alumnusData; }

  add(newAlumnus: AlumnusWithoutId) { // Insert in Database
    return this.http.post(this.ulrAlumnus, newAlumnus, this.httpOptions)
      .pipe(catchError(ErrorService.handleError));
  }

  update(id: string, alumnus: AlumnusWithoutId) {
    return this.http.put(this.ulrAlumnus + id, alumnus, this.httpOptions)
      .pipe(catchError(ErrorService.handleError));
  }

  delete(id: string) {
    return this.http.delete(this.ulrAlumnus + id, this.httpOptions)
      .pipe(catchError(ErrorService.handleError));
  }
}
