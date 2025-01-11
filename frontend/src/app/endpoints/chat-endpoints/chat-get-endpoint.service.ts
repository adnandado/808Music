import { Injectable } from '@angular/core';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {ChatGetResponse} from './chat-create-endpoint.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatGetEndpointService implements MyBaseEndpointAsync<void, ChatGetResponse[]> {
  private readonly url = `${MyConfig.api_address}/api/ChatGetEndpoint`

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: void): Observable<ChatGetResponse[]> {
    return this.httpClient.get<ChatGetResponse[]>(this.url);
  }


}
