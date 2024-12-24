import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface PlaylistUpdateResponse {
  id: number;
  title: string;
  isPublic: boolean;
  coverPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistUpdateEndpointService {
  readonly url = `${MyConfig.api_address}/api/playlists-update`; // Ispravan URL

  constructor(private httpClient: HttpClient) {}

  handleAsync(id: number, formData: FormData): Observable<PlaylistUpdateResponse> {
    // Provjera za obavezne parametre u FormData
    if (!formData.has('title') || !formData.has('isPublic')) {
      return throwError(() => new Error('Required fields are missing.'));
    }

    return this.httpClient.put<PlaylistUpdateResponse>(`${this.url}/${id}`, formData);
  }
}
