import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {inject, Injectable} from "@angular/core";
import {LoginResponse} from '../../endpoints/auth-endpoints/user-auth-login-endpoint.service';
import {AuthTokenInfo} from './dto/auth-token-info';
import {jwtDecode} from "jwt-decode"
import {
  GetNewTokenRequest,
  UserGetNewTokenEndpointService
} from '../../endpoints/auth-endpoints/user-get-new-token-endpoint.service';
import {MyConfig} from '../../my-config';
import {tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {LogoutInfo} from './dto/logout-info';
import {LogoutRequest} from './dto/logout-request';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class MyUserAuthService {
  constructor(private httpClient: HttpClient,
              private router: Router) {
  }

  isLoggedIn(): boolean {
    return this.getAuthToken() != null;
  }

  isAdmin(): boolean {
    return this.getAuthToken()?.isAdmin ?? false;
  }

  /*
  isManager(): boolean {
    return this.getMyAuthInfo()?.isManager ?? false;
  }
  */

  setLoggedInUser(lr: LoginResponse | null, rememberMe: boolean) {
    if(rememberMe) {
      if (lr == null) {
        window.localStorage.setItem("authToken", '');
      } else {
        window.localStorage.setItem("authToken", JSON.stringify(this.generateAuthTokenInfo(lr,rememberMe)));
      }
    }
    else {
      if (lr == null) {
        window.sessionStorage.setItem("authToken", '');
      } else {
        window.sessionStorage.setItem("authToken", JSON.stringify(this.generateAuthTokenInfo(lr,rememberMe)));
      }
    }
  }

  getAuthToken(dontRefresh: boolean = false): AuthTokenInfo | null {
    let tokenString = window.localStorage.getItem("authToken") ?? "";
    if(tokenString === "") {
      tokenString = window.sessionStorage.getItem("authToken") ?? "";
    }
    if(tokenString !== "")
    {
      let auth: AuthTokenInfo = JSON.parse(tokenString);
      //Decode and check if the jwt has expired
      let decodedJwt = jwtDecode(auth!.token);
      if(Date.now() > decodedJwt.exp! * 1000) {
        //if the caller doesn't want to refresh the token (ex. the http req interceptor)
        if(dontRefresh) {
          return null;
        }
        //tries to get a new jwt from the server with the refresh token
        this.getNewJwt(auth).subscribe({
          error: (err :HttpErrorResponse) => {
            alert(err.error);
            this.setLoggedInUser(null, auth.rememberMe);
            window.location.reload();
          }
        });
        this.router.navigate(["/please-wait-a-moment"]);

      }
      return auth;
    }
    else {
      return null;
    }
  }

  public getNewJwt(auth: AuthTokenInfo): Observable<LoginResponse> {
    let url = `${MyConfig.api_address}/api/UserGetNewTokenEndpoint`;
    return this.httpClient.post<LoginResponse>(url,{
      jwtToken: auth.token,
      refreshToken: auth.refreshToken
    }).pipe(tap(response => {
      this.setLoggedInUser(response, auth.rememberMe);
    }));
  }

  private generateAuthTokenInfo(lr: LoginResponse, rememberMe: boolean) : AuthTokenInfo {
    let decodedJwt : any = jwtDecode(lr.token)
    return {
      userId: Number.parseInt(decodedJwt.sub!),
      email: decodedJwt.email,
      isAdmin: true,
      token: lr.token,
      refreshToken: lr.refreshToken,
      rememberMe: rememberMe
    }
  }

  public logOut():LogoutInfo {
    let url = `${MyConfig.api_address}/api/UserLogoutEndpoint`;
    let auth = this.getAuthToken();

    let logoutInfo : LogoutInfo = {
      requestSuccessful: false,
      serverMessage: "Not logged in"
    }

    if(auth !== null)
    {
      let logoutRequest: LogoutRequest = {
        jwtToken: auth?.token!,
        refreshToken: auth?.refreshToken!
      }
      this.httpClient.post(url, logoutRequest, {responseType:"text"}).subscribe({
        next: (data) => {
          logoutInfo.serverMessage = data;
          logoutInfo.requestSuccessful = true;
          this.setLoggedInUser(null, auth?.rememberMe!);
          window.sessionStorage.clear();
        },
        error: (err:HttpErrorResponse) => {
          logoutInfo.serverMessage = err.error;
          logoutInfo.requestSuccessful = false;
        }
      });
    }

    return logoutInfo;
  }
}
