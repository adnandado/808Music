import { Injectable } from '@angular/core';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';

export interface RequestForPasswordReset {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserRequestPasswordResetEndpointService implements MyBaseEndpointAsync<RequestForPasswordReset, string> {
  private url = `${MyConfig.api_address}/api/UserRequestPasswordResetEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: RequestForPasswordReset): Observable<string> {
        return this.httpClient.post(this.url, request, {responseType: 'text'});
  }
}
