import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class UserProfilePictureService {
  readonly apiUrl = `${MyConfig.api_address}/api/users/upload-profile-picture`;

  constructor(private http: HttpClient) {}

  uploadProfilePicture(formData: FormData): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post(this.apiUrl, formData, { headers });
  }
}
