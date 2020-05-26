import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AlumnusEditComponent} from '../alumnus/alumnus-edit/alumnus-edit.component';
import {AuthGuardGuard} from '../login/services/auth-guard.guard';


const adminRoutes: Routes = [
  // {path: 'admin/edit', component: AlumnusEditComponent, canActivate : [AuthGuardGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
