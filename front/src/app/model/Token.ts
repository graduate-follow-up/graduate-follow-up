export class Token {
  constructor(receivedRefreshToken: string, receivedAccessToken: string) {
    this.accessToken = receivedAccessToken;
    this.refreshToken = receivedRefreshToken;
  }

  accessToken: string;
  refreshToken: string;
}
