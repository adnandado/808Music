import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserInviteAcceptRequest {
  inviteToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserInviteAcceptEndpointService implements MyBaseEndpointAsync<UserInviteAcceptRequest, string> {
  readonly url = `${MyConfig.api_address}/api/UserInviteAcceptEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: UserInviteAcceptRequest): Observable<string> {
        return this.httpClient.post(this.url, request, {responseType: 'text'});
  }
}
