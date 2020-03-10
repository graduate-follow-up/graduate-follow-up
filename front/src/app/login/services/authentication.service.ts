import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConnectionService} from './connection.service';
import {ServerService} from '../../service/server.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private connection: ConnectionService, private serverService: ServerService) {
    this.connection.isConnected = this.connection.getConnection();
  }

  auth(login: string, password: string) {

    const connectionSuccessful: boolean = this.serverService.connect(login, password);

    if (connectionSuccessful) {
      this.connection.stockConnection(login);
    }

    return connectionSuccessful;
  }


}
