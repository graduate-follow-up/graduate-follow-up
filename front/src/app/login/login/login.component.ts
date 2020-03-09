import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../services/authentication.service';
import {ConnectionService} from '../services/connection.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  checkoutForm;
  msg = '';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private connectionService: ConnectionService,
    private formBuilder: FormBuilder) {

    if (connectionService.getConnection()) { // already connected
      router.navigate(['']);
    }

    this.checkoutForm = this.formBuilder.group(
      {
        login: '',
        password: ''
      } );
  }


  ngOnInit() {
  }

  login(data) {

    this.authenticationService.auth(data.login, data.password);

    if (!this.connectionService.isConnected) {
      this.msg = 'Connection failed: Identifier or password incorrect';
    } else {
      this.router.navigate(['']);
    }

  }

}
