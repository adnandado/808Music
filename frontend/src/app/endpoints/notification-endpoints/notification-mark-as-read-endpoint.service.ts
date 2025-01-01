import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {buildHttpParams} from '../../helper/http-params.helper';

@Injectable({
  providedIn: 'root'
})
export class NotificationMarkAsReadEndpointService implements MyBaseEndpointAsync<number, any> {
  readonly url = `${MyConfig.api_address}/api/NotificationMarkAsReadEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(id: number): Observable<any> {
    return this.httpClient.post(this.url, null, {params: buildHttpParams({notificationId: id})});
  }
}
