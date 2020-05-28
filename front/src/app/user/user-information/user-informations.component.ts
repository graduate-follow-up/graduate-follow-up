import { Component, OnInit } from '@angular/core';
import {ActionPerformedService} from '../service/action-performed.service';
import {User} from '../../model/User';

@Component({
  selector: 'app-user-informations',
  templateUrl: './user-informations.component.html',
  styleUrls: ['./user-informations.component.css']
})
export class UserInformationsComponent implements OnInit {

  public user: User;

  constructor(private actionPerformed: ActionPerformedService) { }

  ngOnInit() {
    this.user =  this.actionPerformed.getUser();
  }

}
