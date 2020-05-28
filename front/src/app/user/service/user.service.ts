import { Injectable } from '@angular/core';
import {User} from '../../model/User';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {UserWithoutId} from '../../model/user-without-id';
import {ErrorService} from '../../service/error.service';
import {Name} from '../../model/Name';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  private ulrUsers = 'http://proxy/users/';
  private userData: User[];

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})};

  getUserObservable(): Observable<any> {
    return this.http.get<any>(this.ulrUsers)
      .pipe(
          map(res => {
            return res.map( user => {
              const newUser = new User();
              newUser.name = new Name(user.name.first, user.name.last);
              newUser._id = user._id;
              newUser.login = user.login;
              newUser.email = user.email;
              newUser.role = user.role;
              return newUser;
              }
            );
          }),
      catchError(ErrorService.handleError));
  }

  getUser(): User[] { return this.userData; }

  add(newUser: UserWithoutId) { // Insert in Database
    const tmpUser = newUser as any ;
    const userToAdd = `{
    "name": {
      "first": "${tmpUser.first_name}",
      "last" : "${tmpUser.last_name}"
     },
     "email": "${tmpUser.email}",
      "role": "${tmpUser.role}",
      "login": "${tmpUser.login}",
      "password": "${tmpUser.password}"
      }`;
    return this.http.post(this.ulrUsers, userToAdd, this.httpOptions).pipe(catchError(ErrorService.handleError));
  }

  update(id: string, user: UserWithoutId) {
    const tmpUser = user as any ;
    const update = `{
    "name": {
      "first": "${tmpUser.first_name}",
      "last" : "${tmpUser.last_name}"
     },
     "email": "${tmpUser.email}",
      "role": "${tmpUser.role}",
      "login": "${tmpUser.login}"
      }`;
    return this.http.put(this.ulrUsers + id, update, this.httpOptions).pipe(catchError(ErrorService.handleError));
  }

  delete(id: string) {
    return this.http.delete(this.ulrUsers + id, this.httpOptions).pipe(catchError(ErrorService.handleError));
  }
}
