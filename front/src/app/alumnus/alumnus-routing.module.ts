import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlumnusComponent} from './almunus/alumnus.component';
import {AuthGuardGuard} from '../login/services/auth-guard.guard';
import {AlumnusEditComponent} from './alumnus-edit/alumnus-edit.component';
import {AlumnusInformationsComponent} from './alumnus-information/alumnus-informations.component';
import {AlumnusEditByUrlComponent} from './alumnus-edit-by-url/alumnus-edit-by-url.component';


const AlumnusRoutes: Routes = [
  {path: 'alumnus', component: AlumnusComponent, canActivate : [AuthGuardGuard]},
  {path: 'alumnus/edit', component: AlumnusEditComponent, canActivate : [AuthGuardGuard]},
  {path: 'alumnus/information', component: AlumnusInformationsComponent, canActivate : [AuthGuardGuard]},
  {path: 'alumnus/modify/:id', component: AlumnusEditByUrlComponent, canActivate : [AuthGuardGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(AlumnusRoutes)],
  exports: [RouterModule]
})
export class AlumnusRoutingModule { }
