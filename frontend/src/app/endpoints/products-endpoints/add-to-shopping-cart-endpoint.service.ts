import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyAuthService } from '../../services/auth-services/my-auth.service';
import { MyConfig } from '../../my-config';

export interface AddToShoppingCartRequest {
  productId: number;
  userId: number;
  quantity: number;
}

export interface AddToShoppingCartResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AddToShoppingCartEndpointService
  implements MyBaseEndpointAsync<AddToShoppingCartRequest, AddToShoppingCartResponse>
{
  readonly url = `${MyConfig.api_address}/api/AddToShoppingCartEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {}

  handleAsync(request: AddToShoppingCartRequest): Observable<AddToShoppingCartResponse> {
    if (!request.productId || !request.userId || request.quantity < 1) {
      return throwError(() => new Error('All required fields must be provided, and quantity must be at least 1.'));
    }

    return this.httpClient.post<AddToShoppingCartResponse>(this.url, request);
  }
}
