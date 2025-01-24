import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface ToggleFollowRequest {
  userId: number;
  followedUserId: number;
}

export interface ToggleFollowResponse {
  message: string;
  isFollowing: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToggleFollowService {
  private apiUrl = `${MyConfig.api_address}/api/follow`;

  constructor(private httpClient: HttpClient) {}

  toggleFollow(request: ToggleFollowRequest): Observable<ToggleFollowResponse> {
    return this.httpClient.post<ToggleFollowResponse>(this.apiUrl, request);
  }
}
