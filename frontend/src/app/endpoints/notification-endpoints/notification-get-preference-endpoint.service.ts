import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyAppUserPreference} from './notification-set-preference-endpoint.service';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationGetPreferenceEndpointService implements MyBaseEndpointAsync<void, MyAppUserPreference> {
  readonly url = MyConfig.api_address + '/api/NotificationGetPreferenceEndpoint';
  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: void): Observable<MyAppUserPreference> {
    return this.httpClient.get<MyAppUserPreference>(this.url);
  }
}
