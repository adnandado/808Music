import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {MyUserAuthService} from './auth-services/my-user-auth.service';
import {MyConfig} from '../my-config';
import {RichNotification} from './notifications.service';
import {Router} from '@angular/router';
import {MessageGetResponse} from '../endpoints/chat-endpoints/chat-get-messages-endpoint.service';
import {Subject} from 'rxjs';

export interface MessageSendRequest {
  userChatId: number;
  message: string;
  contentId: number;
  contentType: string;
}

export interface MsgSeen {
  id: number;
  seenAt: string;
  seen: boolean;
  userChatId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection!: signalR.HubConnection;
  private msgReceive = new Subject<MessageGetResponse>();
  msgReceived$ = this.msgReceive.asObservable();
  private msgSeen = new Subject<MsgSeen>();
  msgSeen$ = this.msgSeen.asObservable();

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

    this.hubConnection.on("receiveMessage", (data: MessageGetResponse) => {
      console.log(data);
      this.msgReceive.next(data);
    });

    this.hubConnection.on("msgSeen", (data: MsgSeen) => {
      console.log(data);
      this.msgSeen.next(data);
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
