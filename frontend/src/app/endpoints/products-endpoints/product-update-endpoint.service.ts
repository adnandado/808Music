import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyAuthService } from '../../services/auth-services/my-auth.service';
import { MyConfig } from '../../my-config';

export interface ProductUpdateRequest {
  id: number;
  title: string;
  price: number;
  quantity: number;
  isDigital: boolean;
}

export interface ProductUpdateResponse {
  id: number;
  title: string;
  price: number;
  quantity: number;
  isDigital: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductUpdateEndpointService implements MyBaseEndpointAsync<ProductUpdateRequest, ProductUpdateResponse> {
  readonly url = `${MyConfig.api_address}/api/ProductUpdateEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {}

  handleAsync(request: ProductUpdateRequest): Observable<ProductUpdateResponse> {
    if (!request.id || !request.title || request.price == null) {
      return throwError(() => new Error('Sva polja su obavezna.'));
    }

    const headers = { 'Content-Type': 'application/json' };

    const body = {
      id: request.id,
      title: request.title,
      price: request.price,
      quantity: request.quantity,
      isDigital: request.isDigital
    };

    return this.httpClient.put<ProductUpdateResponse>(this.url, body, { headers });
  }
}
