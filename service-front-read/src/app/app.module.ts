import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//material
import {MatToolbarModule} from "@angular/material";
import {MatFormFieldModule} from "@angular/material";
import {MatFormFieldControl} from "@angular/material";

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { EtudiantsComponent } from './etudiants/etudiants.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    EtudiantsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatFormFieldControl
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
