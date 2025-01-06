import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyAuthService } from '../../services/auth-services/my-auth.service';
import { MyConfig } from '../../my-config';

export interface SubscriptionAddRequest {
  userId: number;
  subscriptionType: number;
  renewalOn: boolean;
}

export interface SubscriptionAddResponse {
  success: boolean;
  message: string;
  subscriptionId: number;
  monthlyPrice: number;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubscriptionAddEndpointService implements MyBaseEndpointAsync<SubscriptionAddRequest, SubscriptionAddResponse> {
  readonly url = `${MyConfig.api_address}/api/SubscriptionAddEndpoint/add-subscription`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {}

  handleAsync(request: SubscriptionAddRequest): Observable<SubscriptionAddResponse> {
    if (!request.userId || !request.subscriptionType) {
      return throwError(() => new Error('All fields are required.'));
    }

    return this.httpClient.post<SubscriptionAddResponse>(this.url, request);
  }
}
