import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

interface AlbumCoverResponse {
  trackId: number;
  albumId: number;
  coverPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumCoverService {

  private baseUrl = `${MyConfig.api_address}/api`;

  constructor(private http: HttpClient) { }

  getCoverPathByTrackId(trackId: number): Observable<AlbumCoverResponse> {
    return this.http.get<AlbumCoverResponse>(`${this.baseUrl}/tracks/${trackId}/cover`);
  }
}
