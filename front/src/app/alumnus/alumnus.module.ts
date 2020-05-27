import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlumnusRoutingModule } from './alumnus-routing.module';
import {AlumnusComponent} from './almunus/alumnus.component';
import {AlumnusDetailComponent} from './alumnus-detail/alumnus-detail.component';
import { FilterAlumnusPipe } from './pipe/filter-alumnus.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AlumnusInformationsComponent } from './alumnus-information/alumnus-informations.component';
import { AlumnusEditByUrlComponent } from './alumnus-edit-by-url/alumnus-edit-by-url.component';


@NgModule({
  declarations: [
    AlumnusComponent,
    AlumnusDetailComponent,
    FilterAlumnusPipe,
    AlumnusInformationsComponent,
    AlumnusEditByUrlComponent
  ],
  imports: [
    CommonModule,
    AlumnusRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AlumnusModule { }
