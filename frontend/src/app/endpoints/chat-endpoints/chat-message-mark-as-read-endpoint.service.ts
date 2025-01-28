import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

export interface MsgMarkAsReadRequest {
  messageId: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChatMessageMarkAsReadEndpointService implements MyBaseEndpointAsync<MsgMarkAsReadRequest, number> {
  readonly url = `${MyConfig.api_address}/api/ChatMessageMarkAsReadEndpoint`;
  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: MsgMarkAsReadRequest): Observable<number> {
    return this.httpClient.post<number>(this.url, request);
  }
}
