import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class DeletePlaylistService {
  private readonly url = `${MyConfig.api_address}/api/playlists/playlists-delete`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${id}`);
  }
}
