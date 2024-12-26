import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface AlbumCoverResponse {
  trackId: number;
  albumId: number;
  coverPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumCoverService {

  private baseUrl = 'http://localhost:7000/api'; // URL tvog backend-a

  constructor(private http: HttpClient) { }

  getCoverPathByTrackId(trackId: number): Observable<AlbumCoverResponse> {
    return this.http.get<AlbumCoverResponse>(`${this.baseUrl}/tracks/${trackId}/cover`);
  }
}
