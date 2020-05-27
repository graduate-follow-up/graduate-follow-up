import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ConnectionService} from './connection.service';

@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {

  constructor(private routes: Router, private connectionService: ConnectionService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.connectionService.isLoggedIn()) {
      return true;
    } else {
      this.routes.navigate(['/login']);
      return false;
    }
  }

}
