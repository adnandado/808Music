import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  iD: number | null;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  countryId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserRegisterOrUpdateEndpointService implements MyBaseEndpointAsync<RegisterRequest, string> {
  private url = `${MyConfig.api_address}/api/UserRegisterOrUpdateEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: RegisterRequest): Observable<string> {
        return this.httpClient.post(this.url, request, {responseType: 'text'});
    }


}
