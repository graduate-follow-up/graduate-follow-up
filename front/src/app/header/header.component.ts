import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ConnectionService} from '../login/services/connection.service';


interface AfterViewInit {
  ngAfterViewInit(): void;
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router,
              private connectionService: ConnectionService,
              private deviceService: DeviceDetectorService) { }


  ngOnInit() {
    //this.test.nativeElement.style.color = 'blue';
  }

  /*ngAfterViewInit(): void {
    console.log( 'AAAAAAAAAAAAAAAAAa :' + this.test.nativeElement.textContent);
  }*/


  logout() {
    localStorage.removeItem('login');
    this.router.navigate(['login']);
  }

  login() {
    this.router.navigate(['login']);

  }
}
