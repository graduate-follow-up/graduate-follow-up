import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserComponent} from './user/user.component';
import {AuthGuardGuard} from '../login/services/auth-guard.guard';
import {UserEditComponent} from './user-edit/user-edit.component';
import {UserInformationsComponent} from './user-information/user-informations.component';


const UsersRoutes: Routes = [
  {path: 'users', component: UserComponent, canActivate : [AuthGuardGuard]},
  {path: 'users/edit', component: UserEditComponent, canActivate : [AuthGuardGuard]},
  {path: 'users/information', component: UserInformationsComponent, canActivate : [AuthGuardGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(UsersRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
