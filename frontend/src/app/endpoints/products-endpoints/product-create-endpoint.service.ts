import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {Observable, throwError} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {MyConfig} from '../../my-config';

export interface ProductAddRequest {
  id?: number;
  title: string;
  price: number;
  quantity: number;
  isDigital: boolean;
}

export interface ProductAddResponse {
  title: string;
  quantity: number;
  isDigital: boolean;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductAddEndpointService implements MyBaseEndpointAsync<ProductAddRequest, ProductAddResponse> {
  readonly url = `${MyConfig.api_address}/api/ProductAddEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {}

  handleAsync(request: ProductAddRequest): Observable<ProductAddResponse> {
    if (!request.title || !request.price ) {
      // Vraća grešku ako bilo koji od parametara nije prisutan
      return throwError(() => new Error('All fields are required.'));}
    const headers = { 'Content-Type': 'application/json' };

    const body = {
      title: request.title,
      price: request.price,
      quantity: request.quantity,
      isDigital: request.isDigital
    };

    return this.httpClient.post<ProductAddResponse>(this.url, body, { headers });
  }
}
