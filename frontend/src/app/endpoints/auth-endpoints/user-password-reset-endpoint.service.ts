import { Injectable } from '@angular/core';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';

export interface PasswordResetRequest {
  password: string;
  resetToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserPasswordResetEndpointService implements MyBaseEndpointAsync<PasswordResetRequest, string> {
  private url = `${MyConfig.api_address}/api/UserPasswordResetEndpoint`;

  constructor(private httpClient: HttpClient) {

  }

  handleAsync(request: PasswordResetRequest): Observable<string> {
        return this.httpClient.post(this.url, request, {responseType: 'text'});
  }

}
