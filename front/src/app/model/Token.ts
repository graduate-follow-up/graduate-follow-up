import {AccessToken} from './AccessToken';

export class Token extends AccessToken {
  constructor(receivedRefreshToken: string, receivedAccessToken: string) {
    super(receivedRefreshToken);
    this.refreshToken = receivedRefreshToken;
  }
  refreshToken: string;
}
