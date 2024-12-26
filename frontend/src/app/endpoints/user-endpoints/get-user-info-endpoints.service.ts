import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:7000/api/users';

  constructor(private http: HttpClient) {}

  getUserInfo(userId: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.baseUrl}/${userId}`);
  }
}

export interface UserResponse {
  username: string;
  email: string;
}
