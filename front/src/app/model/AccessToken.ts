export class AccessToken {
  constructor(receivedAccessToken: string) {
    this.accessToken = receivedAccessToken;
  }
  accessToken: string;
}
