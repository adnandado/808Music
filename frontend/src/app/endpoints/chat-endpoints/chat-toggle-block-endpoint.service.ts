import { Injectable } from '@angular/core';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';

export interface ChatBlockResponse {
  id: number;
  isBlocked: boolean;
  blockedByUserId?: number;
  blockedByUser?: string
}

@Injectable({
  providedIn: 'root'
})
export class ChatToggleBlockEndpointService implements MyBaseEndpointAsync<number, ChatBlockResponse> {
  private readonly url = `${MyConfig.api_address}/api/ChatToggleBlockEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(id: number): Observable<ChatBlockResponse> {
    return this.httpClient.get<ChatBlockResponse>(this.url+ "/"+id);
  }
}
