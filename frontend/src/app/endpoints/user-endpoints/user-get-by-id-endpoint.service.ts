import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';

export interface UserGetResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  countryId: number;
  pathToPfp: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserGetByIdEndpointService implements MyBaseEndpointAsync<number, UserGetResponse> {
  readonly url = `${MyConfig.api_address}/api/UserGetByIdEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: number): Observable<UserGetResponse> {
    return this.httpClient.get<UserGetResponse>(this.url+"/"+request);
  }
}
