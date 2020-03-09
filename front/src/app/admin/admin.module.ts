import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import {EditComponent} from './edit/edit.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    EditComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
