import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface PlaylistResponse {
  id: number;
  title: string;
  numOfTracks: number;
  isPublic: boolean;
  coverPath: string;
}

@Injectable({
  providedIn: 'root',
})
export class GetAllPlaylistsService {
  private readonly url = `${MyConfig.api_address}/api/playlists`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(): Observable<PlaylistResponse[]> {
    return this.httpClient.get<PlaylistResponse[]>(this.url);
  }
}
