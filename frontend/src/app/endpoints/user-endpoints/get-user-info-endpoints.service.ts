import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${MyConfig.api_address}/api/users`;

  constructor(private http: HttpClient) {}

  getUserInfo(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${userId}`);
  }
}

export interface UserResponse {
  username: string;
  email: string;
}
