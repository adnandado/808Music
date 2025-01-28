import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {MyUserAuthService} from './auth-services/my-user-auth.service';
import {MyConfig} from '../my-config';
import {Artist} from '../endpoints/album-endpoints/album-get-by-id-endpoint.service';
import {Router} from '@angular/router';

export interface RichNotification {
  guid: string;
  id: number;
  contentId: number;
  imageUrl: string;
  type: string;
  title: string;
  message: string;
  artist: Artist | null;
  createdAt: string;
  priority: boolean;
  hidden?: boolean;
  slug?: string;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private hubConnection!: signalR.HubConnection;

  constructor(private authService: MyUserAuthService, private router: Router) { }

  public startConnection(): void {
    let authToken = this.authService.getAuthToken();
    if(authToken == null)
    {
      this.router.navigate(['/auth/login']);
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

  public addNotificationListener(callback: (message: RichNotification) => void) {
    this.hubConnection.on("notificationReceived", data => {
      callback(data);
    });
  }

  public removeNotificationListener(callback: (message: RichNotification) => void) {
    this.hubConnection.off("notificationReceived", callback);
  }

}
