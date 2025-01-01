import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {MyUserAuthService} from './auth-services/my-user-auth.service';
import {MyConfig} from '../my-config';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private hubConnection!: signalR.HubConnection;

  constructor(private authService: MyUserAuthService) { }

  public startConnection(): void {
    let authToken = this.authService.getAuthToken();
    if(authToken == null)
    {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(MyConfig.api_address+"/notificationsHub", { accessTokenFactory: () => authToken!.token })
      .build();

    this.hubConnection.on("connectionStarted", (val:string) => {
      console.log(val);
    })

    this.hubConnection.start().then(() => {
      console.log("Connection started!");
    }).catch(err => console.log(err));
  }

  public addEventListener(eventName: string, callback: (message: any) => void) {
    this.hubConnection.on(eventName, data => {
      callback(data);
    });
  }

  public removeEventListener(eventName: string, callback: (message: any) => void) {
    this.hubConnection.off(eventName, callback);
  }

}
