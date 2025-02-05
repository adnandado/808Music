import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface UserMonthlyStatsResponse {
  artistRankOnePfp: string;
  artistRankTwoPfp: string;
  artistRankThreePfp: string;
  artistRankFourPfp: string;
  artistRankFivePfp: string;

  minutesStreamed: number;
  streams: number;
  username: string;
  topSongs: TopSong[];
  topArtists: TopArtist[];
}

export interface TopSong {
  id: number;
  title: string;
}

export interface TopArtist {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetUserMonthlyStatsEndpointService {
  private readonly url = `${MyConfig.api_address}/api/GetUserMonthlyStatsEndpoint`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(userId: number): Observable<UserMonthlyStatsResponse> {
    return this.httpClient.get<UserMonthlyStatsResponse>(`${this.url}?UserId=${userId}`);
  }
}
