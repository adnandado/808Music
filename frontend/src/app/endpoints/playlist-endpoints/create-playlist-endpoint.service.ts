import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface PlaylistAddRequest {
  title: string;
  isPublic: boolean;
  coverImage?: File;
  trackIds: number[];
  userId?: number;
}

export interface PlaylistAddResponse {
  id: number;
  title: string;
  numOfTracks: number;
  isPublic: boolean;
  coverPath: string;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class PlaylistCreateService {
  private readonly url = `${MyConfig.api_address}/api/playlists/create`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: PlaylistAddRequest): Observable<PlaylistAddResponse> {
    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('isPublic', request.isPublic.toString());

    if (request.coverImage) {
      formData.append('coverImage', request.coverImage);
    }

    request.trackIds.forEach((trackId) => {
      formData.append('trackIds', trackId.toString());
    });

    if (request.userId !== undefined) {
      formData.append('userId', request.userId.toString());
    }

    return this.httpClient.post<PlaylistAddResponse>(this.url, formData);
  }
}
