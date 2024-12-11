import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserInviteSendRequest {
  roleId: number;
  artistId: number;
  myAppUserId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserInviteSendEndpointService implements MyBaseEndpointAsync<UserInviteSendRequest, string> {
  readonly url = `${MyConfig.api_address}/api/UserInviteSendEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: UserInviteSendRequest): Observable<string> {
        return this.httpClient.post(this.url, request, {responseType: 'text'});
    }
}
