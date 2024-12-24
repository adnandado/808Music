import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface PlaylistUpdateTracksRequest {
  playlistId: number;
  trackIds: number[];
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistUpdateTracksService {
  private readonly url = `${MyConfig.api_address}/api/playlists/update-tracks`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: PlaylistUpdateTracksRequest): Observable<void> {
    return this.httpClient.post<void>(this.url, request);
  }
}
