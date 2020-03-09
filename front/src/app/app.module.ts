import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AuthGuardGuard} from './login/services/auth-guard.guard';
import {LoginModule} from './login/login.module';
import {HttpClientModule} from '@angular/common/http';
import {AlumnusModule} from './alumnus/alumnus.module';
import {HeaderComponent} from './header/header.component';
import {RGPDComponent} from './rgpd/rgpd.component';
import {StatsComponent} from './stats/stats.component';
import { AdminModule } from './admin/admin.module';

const Routes = [
  {path: 'RGPD', component: RGPDComponent},
  {path: 'stats', component: StatsComponent, canActivate: [AuthGuardGuard]},
  {path: '', redirectTo: '/alumnus', pathMatch: 'full', canActivate: [AuthGuardGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RGPDComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(Routes),
    LoginModule,
    HttpClientModule,
    AlumnusModule,
    ReactiveFormsModule,
    AdminModule
  ],
  providers: [AuthGuardGuard],
  bootstrap: [AppComponent]
})
export class AppModule {
}
