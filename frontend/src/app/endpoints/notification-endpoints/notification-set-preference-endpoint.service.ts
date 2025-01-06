import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';

export interface MyAppUserPreference {
  allowPushNotifications: boolean;
  allowEmailNotifications: boolean;
  notificationTypePriority: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationSetPreferenceEndpointService implements MyBaseEndpointAsync<MyAppUserPreference, MyAppUserPreference> {
  readonly url = `${MyConfig.api_address}/api/NotificationSetPreferenceEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: MyAppUserPreference): Observable<MyAppUserPreference> {
    return this.httpClient.post<MyAppUserPreference>(this.url, request);
  }
}
