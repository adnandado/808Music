import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyAuthService } from '../../services/auth-services/my-auth.service';
import { MyConfig } from '../../my-config';

export interface ProductAddRequest {
  title: string;
  price: number;
  quantity: number;
  isDigital: boolean;
  photos?: File[];
  artistId: number
}

export interface ProductAddResponse {
  title: string;
  quantity: number;
  isDigital: boolean;
  price: number;
  slug: string;
  artistId: number
}

@Injectable({
  providedIn: 'root'
})
export class ProductAddEndpointService implements MyBaseEndpointAsync<ProductAddRequest, ProductAddResponse> {
  readonly url = `${MyConfig.api_address}/api/ProductAddEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {
  }

  handleAsync(request: ProductAddRequest): Observable<ProductAddResponse> {
    if (!request.title || !request.price) {
      return throwError(() => new Error('All fields are required.'));
    }

    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('price', request.price.toString());
    formData.append('quantity', request.quantity.toString());
    formData.append('isDigital', request.isDigital.toString());
    formData.append('artistId', request.artistId.toString());

    if (request.photos && request.photos.length > 0) {
      for (let i = 0; i < request.photos.length; i++) {
        formData.append('photos', request.photos[i]);
      }
    }

    return this.httpClient.post<ProductAddResponse>(this.url, formData);
  }
}
