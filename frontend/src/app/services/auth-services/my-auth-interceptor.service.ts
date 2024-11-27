import {Injectable} from "@angular/core";
import {HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {MyAuthService} from "./my-auth.service";
import {MyUserAuthService} from './my-user-auth.service';

@Injectable()
export class MyAuthInterceptor implements HttpInterceptor {

  constructor(private auth: MyUserAuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const jwt = this.auth.getAuthToken(true)?.token ?? "";
    if(jwt != "")
    {
      // Clone the request and replace the original headers with
      // cloned headers, updated with the authorization.
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${jwt}`)
      });
      // send cloned request with header to the next handler.
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}

/*
export class MyAuthInterceptor implements HttpInterceptor {

  constructor(private auth: MyAuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.getLoginToken()?.token ?? "";

    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('my-auth-token', authToken)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
*/
