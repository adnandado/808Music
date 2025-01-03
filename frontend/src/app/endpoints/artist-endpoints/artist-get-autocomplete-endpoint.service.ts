import {Injectable, OnInit} from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {UserSearchRequest} from '../user-endpoints/user-search-endpoint.service';
import {ArtistSimpleDto} from '../../services/auth-services/dto/artist-dto';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import {buildHttpParams} from '../../helper/http-params.helper';
import {tap} from 'rxjs/operators';

export interface UserArtistSearchRequest {
  searchString: string;
  leadTrackId?: number;
  returnAmount?: number;
  sortByPopularity?: boolean;
  needsToHaveSongs?: boolean;
  sortByStreams?: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ArtistGetAutocompleteEndpointService implements MyBaseEndpointAsync<UserArtistSearchRequest, ArtistSimpleDto[]> {
  readonly url = `${MyConfig.api_address}/api/ArtistGetAutocompleteEndpoint`;
  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: UserArtistSearchRequest): Observable<ArtistSimpleDto[]> {
      return this.httpClient.get<ArtistSimpleDto[]>(this.url,{params:buildHttpParams(request)})/*.pipe(
        tap(response => {
          response.forEach((artist) => {
            artist.pfpPath = MyConfig.api_address + artist.pfpPath;
          })
        })
      );
      */
    }
}
