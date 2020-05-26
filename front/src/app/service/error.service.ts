import { Injectable } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private static errorHandle = false;
  private static errorMsg: string;

  constructor() { }

  static handleError(error: HttpErrorResponse) {

    // Change Status class to Error
    ErrorService.errorHandle = true;

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      ErrorService.errorMsg = 'An error occurred:' + error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      ErrorService.errorMsg =
        'Request returned code ' + error.status +
        ' |  body was: ' + error.error.message + ' Status : ' + error.error.status +
        ' | Error : ' + error.statusText;
    }

    // Display in console
    console.error(this.errorMsg);
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  public errorDetect(): boolean {
    return ErrorService.errorHandle;
  }

  public getErrorMessage(): string {
    return ErrorService.errorMsg;
  }
}
