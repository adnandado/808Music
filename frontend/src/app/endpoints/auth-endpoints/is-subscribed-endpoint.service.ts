import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface IsSubscribedRequest {
  userId: number;
}

export interface IsSubscribedResponse {
  isSubscribed: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class IsSubscribedService {
  private apiUrl = `${MyConfig.api_address}/api/IsSubscribedEndpoint/api/IsSubscribed`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: IsSubscribedRequest): Observable<IsSubscribedResponse> {
    const params = new HttpParams().set('userId', request.userId.toString());
    return this.httpClient.get<IsSubscribedResponse>(this.apiUrl, { params });
  }
}
