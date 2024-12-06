import { Injectable } from '@angular/core';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';

export interface UserArtistRole {
  id: number;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesGetAllEndpointService implements MyBaseEndpointAsync<void, UserArtistRole[]> {
  readonly url = `${MyConfig.api_address}/api/RolesGetAllEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: void): Observable<UserArtistRole[]> {
        return this.httpClient.get<UserArtistRole[]>(this.url);
  }


}
