import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface SubscriptionCancelRequest {
  userId: number;
}

export interface SubscriptionCancelResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionCancelEndpointService implements MyBaseEndpointAsync<SubscriptionCancelRequest, SubscriptionCancelResponse> {
  readonly url = `${MyConfig.api_address}/api/cancel-subscription`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: SubscriptionCancelRequest): Observable<SubscriptionCancelResponse> {
    if (!request.userId) {
      return throwError(() => new Error('User ID is required.'));
    }

    return this.httpClient.delete<SubscriptionCancelResponse>(`${this.url}?userId=${request.userId}`);
  }
}
