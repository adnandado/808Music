import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface AddTrackToLikedSongsRequest {
  trackId: number;
  userId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class AddTrackToLikedSongsService {
  private readonly url = `${MyConfig.api_address}/api/playlists/add-to-liked-songs`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: AddTrackToLikedSongsRequest): Observable<{ Message: string }> {
    return this.httpClient.post<{ Message: string }>(this.url, request);
  }
}
