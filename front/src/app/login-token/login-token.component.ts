import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ConnectionService} from '../login/services/connection.service';
import {AccessToken} from '../model/AccessToken';

@Component({
  selector: 'app-login-token',
  templateUrl: './login-token.component.html',
  styleUrls: ['./login-token.component.css']
})
export class LoginTokenComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private connexionService: ConnectionService) { }

  ngOnInit() {
    this.route.params.subscribe(
      obj => {
        this.connexionService.useToken(new AccessToken(obj.token));
        let id = localStorage.getItem('id');
        this.router.navigate(['/alumnus/modify/' + id]);
      }
  );
  }

}
