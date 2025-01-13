import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private readonly apiUrl = `${MyConfig.api_address}/api/users`;

  constructor(private http: HttpClient) {}

  getProfilePicture(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile-picture/${userId}`);
  }
}
