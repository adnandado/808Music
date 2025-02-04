import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface GetUserArtistStatsRequest {
  userId: number;
  artistId: number;
}

export interface GetUserArtistStatsResponse {
  daysFollowing: number;
  minutesPlayed: number;
  likedSongs: number;
  artistRank: number;
  userProfilePicture: string;
  artistProfilePicture: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetUserArtistStatsEndpointService {
  private readonly url = `${MyConfig.api_address}/api/GetUserArtistStatsEndpoint`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: GetUserArtistStatsRequest): Observable<GetUserArtistStatsResponse> {
    return this.httpClient.get<GetUserArtistStatsResponse>(`${this.url}?userId=${request.userId}&artistId=${request.artistId}`);
  }
}
