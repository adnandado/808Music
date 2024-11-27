import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {tap} from 'rxjs/operators';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {MyUserAuthService} from '../../services/auth-services/my-user-auth.service';

export interface LoginRequest {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserAuthLoginEndpointService implements MyBaseEndpointAsync<LoginRequest, LoginResponse> {
  private apiUrl = `${MyConfig.api_address}/api/UserAuthLoginEndpoint`;
  constructor(private httpClient: HttpClient, private myAuthService: MyUserAuthService) {
  }

  handleAsync(request: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(this.apiUrl, request).pipe(
      tap((response) => {
        this.myAuthService.setLoggedInUser(response, request.rememberMe ?? true)
      })
    );
  }
}
