import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';

export interface UserArtistRemoveRequest {
  userId: number;
  artistId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserArtistRemoveEndpointService implements MyBaseEndpointAsync<UserArtistRemoveRequest, string> {
  readonly url = `${MyConfig.api_address}/api/UserArtistRemoveEndpoint`;
  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: UserArtistRemoveRequest): Observable<string> {
        return this.httpClient.delete(this.url, {body: request, responseType: 'text'});
  }
}
