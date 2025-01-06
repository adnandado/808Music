import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface SubscriptionUpdateRequest {
  userId: number;
  subscriptionType: number;
  renewalOn: boolean;
}

export interface SubscriptionUpdateResponse {
  success: boolean;
  message: string;
  subscriptionId: number;
  monthlyPrice: number;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionUpdateEndpointService implements MyBaseEndpointAsync<SubscriptionUpdateRequest, SubscriptionUpdateResponse> {
  readonly url = `${MyConfig.api_address}/api/update-subscription`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: SubscriptionUpdateRequest): Observable<SubscriptionUpdateResponse> {
    if (!request.userId || !request.subscriptionType) {
      return throwError(() => new Error('All fields are required.'));
    }

    return this.httpClient.put<SubscriptionUpdateResponse>(this.url, request);
  }
}
