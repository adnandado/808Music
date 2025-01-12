import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MessageGetResponse} from './chat-get-messages-endpoint.service';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MarkAsReadRequest {
  msgs: MessageGetResponse[]
}

@Injectable({
  providedIn: 'root'
})
export class ChatMarkAsReadEndpointService implements MyBaseEndpointAsync<MarkAsReadRequest, void> {
  private readonly url = `${MyConfig.api_address}/api/ChatMarkAsReadEndpoint`

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: MarkAsReadRequest): Observable<void> {
    return this.httpClient.post<void>(this.url, request);
  }
}
