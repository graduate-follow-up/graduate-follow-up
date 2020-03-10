import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlumnusComponent} from './almunus/alumnus.component';
import {AuthGuardGuard} from '../login/services/auth-guard.guard';


const AlumnusRoutes: Routes = [
  {path: 'alumnus', component: AlumnusComponent, canActivate : [AuthGuardGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(AlumnusRoutes)],
  exports: [RouterModule]
})
export class AlumnusRoutingModule { }
