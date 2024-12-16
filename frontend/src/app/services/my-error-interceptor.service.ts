import {inject, Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, Observable, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MyErrorInterceptorService implements HttpInterceptor {
  private snackBar = inject(MatSnackBar);

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError((err:HttpErrorResponse) => {
          this.handleError(err);

          return throwError(() => err);
    }));
    }

  private handleError(err: HttpErrorResponse) {
    if(err.error instanceof ErrorEvent) {
      this.snackBar.open(`Client issue: ${err.error.message}`, "Dismiss", {duration: 3500});
    }
    else {
      this.snackBar.open(`Server issue: ${err.status} - ${err.message}`, "Dismiss", {duration: 3500});
    }
  }
}
