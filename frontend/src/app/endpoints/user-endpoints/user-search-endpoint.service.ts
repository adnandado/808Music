import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {buildHttpParams} from '../../helper/http-params.helper';
import { Observable } from 'rxjs';

export interface UserSearchRequest {
  searchString: string;
  returnAmount?: number;
}

export interface UserSearchResponse {
  id: number;
  username: string;
  roleId?: number;
  profilePicture?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserSearchEndpointService implements MyBaseEndpointAsync<UserSearchRequest, UserSearchResponse[]> {
  readonly url = `${MyConfig.api_address}/api/UserSearchEndpoint`;

  constructor(private httpClient: HttpClient) {

  }

  handleAsync(request: UserSearchRequest): Observable<UserSearchResponse[]> {
      let params = buildHttpParams(request);
      return this.httpClient.get<UserSearchResponse[]>(this.url, {params: params});
    }
}
