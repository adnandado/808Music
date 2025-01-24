import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface IsFollowingRequest {
  followerUserId: number;
  followedUserId: number;
}

export interface IsFollowingResponse {
  isFollowing: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class IsFollowingService {
  private apiUrl = `${MyConfig.api_address}/api/follow/is-following`;

  constructor(private httpClient: HttpClient) {}

  checkIfFollowing(request: IsFollowingRequest): Observable<IsFollowingResponse> {
    const params = new HttpParams()
      .set('followerUserId', request.followerUserId.toString())
      .set('followedUserId', request.followedUserId.toString());

    return this.httpClient.get<IsFollowingResponse>(this.apiUrl, { params });
  }
}
