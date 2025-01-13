import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface PlaylistByIdResponse {
  id: number;
  title: string;
  numOfTracks: number;
  isPublic: boolean;
  coverPath: string;
  isLikePlaylist : boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GetPlaylistByIdEndpointService {
  private readonly url = `${MyConfig.api_address}/api/playlists`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(id: number): Observable<PlaylistByIdResponse> {
    return this.httpClient.get<PlaylistByIdResponse>(`${this.url}/${id}`);
  }
}
