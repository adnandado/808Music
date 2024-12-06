import {Injectable, OnInit} from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {UserArtistRole} from './roles-get-all-endpoint.service';

export interface UserArtistGetAllResponse {
  id: number;
  username: string;
  role: UserArtistRole;
  rolesChanged? : boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserArtistsGetAllEndpointService implements MyBaseEndpointAsync<number, UserArtistGetAllResponse[]> {
  readonly url = MyConfig.api_address + "/api/UserArtistsGetAllEndpoint"

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: number): Observable<UserArtistGetAllResponse[]> {
        return this.httpClient.get<UserArtistGetAllResponse[]>(this.url+"/"+request);
    }

}
