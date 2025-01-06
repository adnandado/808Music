import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface OrderAddRequest {
  userId: number;
}

export interface OrderAddResponse {
  orderId: number;
  orderCode: string;
  totalPrice: number;
  message: string;
  userId: number;
  orderDetails: OrderDetailResponse[];
}

export interface OrderDetailResponse {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrderAddEndpointService
  implements MyBaseEndpointAsync<OrderAddRequest, OrderAddResponse>
{
  readonly url = `${MyConfig.api_address}/api/OrderAddEndpoint`;  // Endpoint za narudžbu

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: OrderAddRequest): Observable<OrderAddResponse> {
    if (!request.userId) {
      return throwError(() => new Error('UserId is required.'));
    }

    return this.httpClient.post<OrderAddResponse>(this.url, request);
  }
}
