import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class RemoveTrackFromPlaylistService {
  private readonly url = `${MyConfig.api_address}/api/playlists`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(playlistId: number, trackId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${playlistId}/tracks/${trackId}`);
  }
}
