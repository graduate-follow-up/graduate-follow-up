import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlumnusComponent} from './almunus/alumnus.component';
import {AuthGuardGuard} from '../login/services/auth-guard.guard';
import {AlumnusEditComponent} from './alumnus-edit/alumnus-edit.component';


const AlumnusRoutes: Routes = [
  {path: 'alumnus', component: AlumnusComponent, canActivate : [AuthGuardGuard]},
  {path: 'alumnus/edit', component: AlumnusEditComponent, canActivate : [AuthGuardGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(AlumnusRoutes)],
  exports: [RouterModule]
})
export class AlumnusRoutingModule { }
