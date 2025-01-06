import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleNotificationsEndpointService implements MyBaseEndpointAsync<number, string> {
  readonly url = `${MyConfig.api_address}/api/ToggleNotificationsEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(id: number): Observable<string> {
        return this.httpClient.post(this.url + "/" + id, {}, {responseType: 'text'});
  }
}
