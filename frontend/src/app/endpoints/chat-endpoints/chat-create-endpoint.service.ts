import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatCreateRequest {
  secondaryUserId: number;
}

export interface ChatGetResponse {
  id: number;
  chatter: string;
  otherChatter: string;
  lastMessage: string;
  muted: boolean;
  blocked: boolean;
  createdAt: string;
  lastMessageAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatCreateEndpointService implements MyBaseEndpointAsync<ChatCreateRequest, ChatGetResponse> {
  private readonly url = `${MyConfig.api_address}/api/ChatCreateEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: ChatCreateRequest): Observable<ChatGetResponse> {
    return this.httpClient.post<ChatGetResponse>(this.url, request);
  }
}
