import { Injectable } from '@angular/core';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';

export interface UserArtistAddRequest {
  artistId: number;
  roleId: number;
  addUserId: number;
}

export interface UserArtistAddResponse {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserArtistAddOrUpdateRoleEndpointService implements MyBaseEndpointAsync<UserArtistAddRequest, UserArtistAddResponse> {
  readonly url = MyConfig.api_address + "/api/UserArtistAddOrUpdateRoleEndpoint";

  constructor(private httpClient: HttpClient) {

  }

  handleAsync(request: UserArtistAddRequest): Observable<UserArtistAddResponse> {
        return this.httpClient.post<UserArtistAddResponse>(this.url, request);
    }

}
