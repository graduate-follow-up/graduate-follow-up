import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnusRoutingModule } from './alumnus-routing.module';
import {AlumnusComponent} from './almunus/alumnus.component';
import {AlumnusDetailComponent} from './alumnus-detail/alumnus-detail.component';
import { FilterAlumnusPipe } from './pipe/filter-alumnus.pipe';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    AlumnusComponent,
    AlumnusDetailComponent,
    FilterAlumnusPipe
  ],
  imports: [
    CommonModule,
    AlumnusRoutingModule,
    FormsModule
  ]
})
export class AlumnusModule { }
