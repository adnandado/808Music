import {Injectable} from '@angular/core';
import {MyConfig} from '../../my-config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserFollowService {
  private apiUrl = `${MyConfig.api_address}/api/follow`;

  constructor(private httpClient: HttpClient) {}

  getFollowingAndFollowers(userId: number): Observable<any> {
    const params = new HttpParams().set('userId', userId.toString());
    return this.httpClient.get<any>(`${this.apiUrl}/following-and-followers`, { params });
  }
}
