import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AuthGuardGuard} from './login/services/auth-guard.guard';
import {LoginModule} from './login/login.module';
import {HttpClientModule} from '@angular/common/http';
import {AlumnusModule} from './alumnus/alumnus.module';
import {UsersModule} from './user/users.module';
import {HeaderComponent} from './header/header.component';
import {RGPDComponent} from './rgpd/rgpd.component';
import {StatsComponent} from './stats/stats.component';
import {AdminModule} from './admin/admin.module';
import {DeviceDetectorService} from 'ngx-device-detector';
import {MatMenuModule} from '@angular/material/menu';
import {MatCommonModule} from '@angular/material/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptor} from './login/token.interceptor';
import { ToastrModule } from 'ngx-toastr';
import {UserComponent} from './user/user/user.component';
import { LoginTokenComponent } from './login-token/login-token.component';

const Routes = [
  {path: 'loginToken/:token', component: LoginTokenComponent},
  {path: 'RGPD', component: RGPDComponent},
  {path: 'stats', component: StatsComponent, canActivate: [AuthGuardGuard]},
  {path: 'user', component: UserComponent, canActivate: [AuthGuardGuard]},
  {path: '', redirectTo: '/alumnus', pathMatch: 'full', canActivate: [AuthGuardGuard]}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RGPDComponent,
    StatsComponent,
    LoginTokenComponent
  ],
  imports: [
    NgbAlertModule,
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(Routes),
    LoginModule,
    HttpClientModule,
    AlumnusModule,
    UsersModule,
    ReactiveFormsModule,
    AdminModule,
    MatMenuModule,
    MatCommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthGuardGuard, DeviceDetectorService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
