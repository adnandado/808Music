import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {LoginResponse} from './user-auth-login-endpoint.service';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {tap} from 'rxjs/operators';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {MyUserAuthService} from '../../services/auth-services/my-user-auth.service';

export interface GetNewTokenRequest {
  jwtToken: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserGetNewTokenEndpointService implements MyBaseEndpointAsync<GetNewTokenRequest, LoginResponse> {
  private apiUrl = `${MyConfig.api_address}/api/UserGetNewTokenEndpoint`;
  private rememberMe:boolean = false;
  constructor(private httpClient: HttpClient, private myAuthService: MyUserAuthService) {
    this.rememberMe = this.myAuthService.getAuthToken()?.rememberMe!;
  }

  handleAsync(request: GetNewTokenRequest): Observable<LoginResponse> {
        return this.httpClient.post<LoginResponse>(this.apiUrl, request).pipe(
          tap((response) => {
            this.myAuthService.setLoggedInUser(response, this.rememberMe);
          })
        )
    }
}
