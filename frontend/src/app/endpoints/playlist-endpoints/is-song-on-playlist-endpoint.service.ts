import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';
import {IsLikedSongRequest, IsLikedSongResponse} from './is-liked-song-endpoint.service';

export interface IsOnPlaylistRequest {
  trackId: number;
  playlistId: number;
}

export interface IsOnPlaylistResponse {
  isAlreadyOnPlaylist: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class IsOnPlaylistService {
  private apiUrl = `${MyConfig.api_address}/api/IsSongOnPlaylistEndpoint`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: IsOnPlaylistRequest): Observable<IsOnPlaylistResponse> {
    const params = new HttpParams()
      .set('trackId', request.trackId)
      .set('PlaylistId', request.playlistId.toString());

    return this.httpClient.get<IsOnPlaylistResponse>(this.apiUrl, { params });
  }
}
