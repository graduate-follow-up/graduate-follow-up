import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {DataUserService} from '../service/dataUser.service';
import {ConnectionService} from '../login/services/connection.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, private connectionService: ConnectionService) { }

  ngOnInit() {
  }

  logout() {
    localStorage.removeItem('login');
    this.router.navigate(['login']);
  }

  login() {
    this.router.navigate(['login']);

  }
}
