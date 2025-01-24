import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {map, Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {MyPagedRequest} from '../../helper/my-paged-request';
import {MyPagedList} from '../../services/auth-services/dto/my-paged-list';
import {buildHttpParams} from '../../helper/http-params.helper';

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
export interface MessageGetRequest extends MyPagedRequest {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatGetMessagesEndpointService implements MyBaseEndpointAsync<MessageGetRequest, MyPagedList<MessageGetResponse>> {
  private readonly url = `${MyConfig.api_address}/api/ChatGetMessagesEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: MessageGetRequest): Observable<MyPagedList<MessageGetResponse>> {
    let params = buildHttpParams(request);
    return this.httpClient.get<MyPagedList<MessageGetResponse>>(this.url, {params: params});
  }
}
