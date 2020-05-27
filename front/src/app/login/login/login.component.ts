import {Component, OnInit} from '@angular/core';
import {ConnectionService} from '../services/connection.service';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {ServerService} from '../../service/server.service';

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
    private connectionService: ConnectionService,
    private formBuilder: FormBuilder,
    private serverService: ServerService) {

    if (connectionService.isLoggedIn()) { // already connected
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
    this.serverService.connect(data.login, data.password).subscribe(
      response => {
        this.connectionService.stockConnection(response);
        this.router.navigate(['/alumnus']);
        this.msg = 'Successfull login';
      },
      error => {
        this.msg = 'Connection failed: Identifier or password incorrect';
      });
  }
}
