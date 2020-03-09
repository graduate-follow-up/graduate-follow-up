import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuardGuard} from './services/auth-guard.guard';


const LoginRoutes: Routes = [
  {path: 'login', component: LoginComponent},
];


@NgModule({
  imports: [RouterModule.forChild(LoginRoutes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
