import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface IsLikedSongRequest {
  trackId: number;
  userId: number;
}

export interface IsLikedSongResponse {
  isLikedSong: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class IsLikedSongService {
  private apiUrl = `${MyConfig.api_address}/api/IsLikedSong`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: IsLikedSongRequest): Observable<IsLikedSongResponse> {
    const params = new HttpParams()
      .set('TrackId', request.trackId)
      .set('UserId', request.userId.toString());

    return this.httpClient.get<IsLikedSongResponse>(this.apiUrl, { params });
  }
}
