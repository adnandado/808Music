import { Injectable } from '@angular/core';
import { MyConfig } from '../../my-config';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildHttpParams } from '../../helper/http-params.helper';
import { MyPagedList } from '../../services/auth-services/dto/my-paged-list';
import {TrackGetResponse} from '../track-endpoints/track-get-by-id-endpoint.service';


export interface PlaylistTracksGetRequest {
  pageNumber?: number;
  pageSize?: number;
  playlistId: number;
  albumId?: number;
  leadArtistId?: number;
  featuredArtists?: number[];
  title?: string;
  isReleased?: boolean;
  sortByStreams?: boolean;
}

export interface PlaylistTracksGetResponse {
  playlistId: number;
  playlistTitle: string;
  tracks: TrackGetResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistTracksGetEndpointService
  implements MyBaseEndpointAsync<PlaylistTracksGetRequest, MyPagedList<TrackGetResponse>> {
  readonly url = `${MyConfig.api_address}/api/PlaylistTracksGetEndpoint`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: PlaylistTracksGetRequest): Observable<MyPagedList<TrackGetResponse>> {
    const params = buildHttpParams(request);
    return this.httpClient.get<MyPagedList<TrackGetResponse>>(this.url, { params });
  }
}
