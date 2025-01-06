import {Injectable, OnInit} from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {ArtistSimpleDto} from '../../services/auth-services/dto/artist-dto';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArtistFollowResponse extends ArtistSimpleDto {
  wantsNotifications: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ArtistGetFollowedByUserEndpointService implements MyBaseEndpointAsync<void, ArtistFollowResponse[]> {
  readonly url = `${MyConfig.api_address}/api/ArtistGetFollowedByUserEndpoint`;

  constructor(private http: HttpClient) {
  }

  handleAsync(request: void): Observable<ArtistFollowResponse[]> {
   return this.http.get<ArtistFollowResponse[]>(this.url);
  }

}
