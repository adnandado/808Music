import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import imageCompression from 'browser-image-compression';

@Injectable({
  providedIn: 'root'
})
export class MyImgCompressInterceptorService implements HttpInterceptor {

  constructor(private http: HttpClient) {
  }
  getType(name: string) {
      if(name.endsWith('.jpg') || name.endsWith('.jpeg')) {
        return "image/jpeg";
      }
      else if(name.endsWith('.png')) {
        return "image/png";
      }
      return "";
    }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.serializeBody() instanceof FormData) {
      let formData = req.serializeBody() as FormData;
      let processing = false;
      formData.forEach((value, key, parent) => {
        if(value instanceof File) {
          if(value.name.endsWith('.jpg') || value.name.endsWith('.jpeg') || value.name.endsWith('.png')) {
            let temp = new File([value],value.name, {type: this.getType(value.name)});
            processing = true;
            let promise = imageCompression(temp,{maxSizeMB:5, useWebWorker:false}).then(compressedImage => {
              let file = new File([compressedImage],value.name, {type: this.getType(value.name)});
              formData.set(key, file);
              processing = false;
            });
          }
        }
      });
      let cloned = req.clone({
        body: formData,
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
