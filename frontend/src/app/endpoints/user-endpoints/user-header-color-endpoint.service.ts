import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class UserHeaderColorService {
  private apiUrl = `${MyConfig.api_address}/api/users`;

  constructor(private http: HttpClient) {}

  getHeaderColor(userId: number): Observable<{ headerColor: string }> {
    return this.http.get<{ headerColor: string }>(`${this.apiUrl}/header-color/${userId}`);
  }

  updateHeaderColor(userId: number, headerColor: string): Observable<any> {
    const body = { headerColor };
    return this.http.put(`${this.apiUrl}/header-color/${userId}`, body);
  }
}
