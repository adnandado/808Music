import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Follow {
  myAppUserId: number;
  artistId: number;
  startedFollowing: string;
  wantsNotifications: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CheckFollowEndpointService implements MyBaseEndpointAsync<number, Follow | null> {
  private readonly url = `${MyConfig.api_address}/api/CheckFollowEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(id: number): Observable<Follow | null> {
    return this.httpClient.get<Follow | null>(this.url+"/"+id);
  }
}
