import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {MyUserAuthService} from './auth-services/my-user-auth.service';
import {MyConfig} from '../my-config';
import {RichNotification} from './notifications.service';
import {Router} from '@angular/router';
import {MessageGetResponse} from '../endpoints/chat-endpoints/chat-get-messages-endpoint.service';

export interface MessageSendRequest {
  userChatId: number;
  message: string;
  contentId: number;
  contentType: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
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
      .withUrl(MyConfig.api_address+"/chatHub", { accessTokenFactory: () => authToken!.token })
      .build();

    this.hubConnection.on("chatStarted", (val:string) => {
      console.log(val);
    })

    this.hubConnection.start().then(() => {
      console.log("Connection started!");
    }).catch(err => console.log(err));

    this.hubConnection.on("receiveMessage", data => {
      console.log(data);
    });
  }

  public sendMessage(msg : MessageSendRequest) {
    return this.hubConnection.invoke<number>("SendMessage", msg);
  }

  public addMessageListener(callback: (message: MessageGetResponse) => void) {
    this.hubConnection.on("receiveMessage", (data: MessageGetResponse) => {
      callback(data);
    });
  }

  public removeMessageListener(callback: (message: MessageGetResponse) => void) {
    this.hubConnection.off("receiveMessage", callback);
  }

}
