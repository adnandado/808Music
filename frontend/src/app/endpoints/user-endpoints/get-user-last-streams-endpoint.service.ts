import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class GetUserLastStreamsEndpointService {
  private baseUrl = `${MyConfig.api_address}/api/GetUserLastStreamsEndpoint`;

  constructor(private http: HttpClient) {}

  getUserLastStreams(userId: number): Observable<ArtistInfoResponse[]> {
    return this.http.get<ArtistInfoResponse[]>(`${this.baseUrl}?UserId=${userId}`);
  }
}

export interface ArtistInfoResponse {
  artistId: number;
  artistName: string;
  artistPfp: string;
  followerCount : number;
}
