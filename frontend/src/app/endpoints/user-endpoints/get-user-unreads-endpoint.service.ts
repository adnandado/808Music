import { Injectable } from '@angular/core';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {map, Observable} from 'rxjs';

export interface UnreadsResponse {
  unreadMessaggesCount: number;
  unreadNotificationsCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class GetUserUnreadsEndpointService implements MyBaseEndpointAsync<void, UnreadsResponse> {
  readonly url = `${MyConfig.api_address}/api/GetUserUnreadsEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: void): Observable<UnreadsResponse> {
    return this.httpClient.get<UnreadsResponse>(this.url).pipe(
      map((response: UnreadsResponse) => {
        if(response.unreadMessaggesCount > 99)
          response.unreadMessaggesCount = 99;
        if(response.unreadNotificationsCount > 99)
          response.unreadNotificationsCount = 99;
        return response;
      })
    );
  }
}
