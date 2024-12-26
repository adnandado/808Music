import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlaylistTracksGetRequest {
  PlaylistId: number;
}

export interface TrackDto {
  id: number;
  title: string;
  length: number;
  streams: number;
  isExplicit: boolean;
}

export interface PlaylistTracksGetResponse {
  playlistId: number;
  playlistTitle: string;
  tracks: TrackDto[];
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistTracksEndpointService {
  private readonly baseUrl = 'http://localhost:7000/api/PlaylistTracksGetEndpoint';

  constructor(private http: HttpClient) {}

  getPlaylistTracks(request: PlaylistTracksGetRequest): Observable<PlaylistTracksGetResponse> {
    const params = { PlaylistId: request.PlaylistId.toString() };
    return this.http.get<PlaylistTracksGetResponse>(this.baseUrl, { params });
  }
}
