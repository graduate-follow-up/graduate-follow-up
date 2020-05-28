import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {UserDetailComponent} from './user-detail/user-detail.component';
import {UserComponent} from './user/user.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterUserPipe} from './pipe/filter-user.pipe';
import {UserEditComponent} from './user-edit/user-edit.component';
import {UserInformationsComponent} from './user-information/user-informations.component';


@NgModule({
  declarations: [
    UserComponent,
    UserDetailComponent,
    UserEditComponent,
    UserInformationsComponent,
    FilterUserPipe
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class UsersModule { }
