import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';

export interface MessageGetResponse {
  id: number;
  userChatId: number;
  message: string;
  contentId: number;
  contentType: string;
  content: any;
  senderId: number;
  sender: string;
  sentAt: string;
  seen: boolean;
  seenAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatGetMessagesEndpointService implements MyBaseEndpointAsync<number, MessageGetResponse[]> {
  private readonly url = `${MyConfig.api_address}/api/ChatGetMessagesEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(id: number): Observable<MessageGetResponse[]> {
    return this.httpClient.get<MessageGetResponse[]>(this.url+"/"+id);
  }
}
