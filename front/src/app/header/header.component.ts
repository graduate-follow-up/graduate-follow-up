import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {ConnectionService} from '../login/services/connection.service';
import {ServerService} from '../service/server.service';


interface AfterViewInit {
  ngAfterViewInit(): void;
}
interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [
  {
  type: 'success',
  message: 'Successfully logged out',
}
];


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  alerts: Alert[] = [];
  staticAlertClosed = false;

  constructor(private router: Router,
              public connectionService: ConnectionService,
              private deviceService: DeviceDetectorService,
              private serverService: ServerService) {
    this.reset();
  }

  ngOnInit() {
    this.alerts = [];
  }

  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  reset() {
    this.alerts = Array.from(ALERTS);
  }

  setTimeoutAlerts() {
    setTimeout(() => {this.alerts = []; }, 7000);
  }

  logout() {
    this.serverService.disconnect(sessionStorage.getItem('refreshToken')).subscribe(
      response => {
        this.connectionService.logout();
        this.alerts.push({type: 'success', message: 'Successfully logged out'});
        this.setTimeoutAlerts();
        this.router.navigate(['login']);
      },
      error => {
        console.log(error);
        this.connectionService.logout();
        this.router.navigate(['login']);
      }
      );
  }

  login() {
    this.router.navigate(['login']);
  }
}
