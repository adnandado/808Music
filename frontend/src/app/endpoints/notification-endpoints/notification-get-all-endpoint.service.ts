import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {RichNotification} from '../../services/notifications.service';
import {map, Observable} from 'rxjs';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificationGetAllEndpointService implements MyBaseEndpointAsync<void, RichNotification[]> {
  readonly url = MyConfig.api_address + '/api/NotificationGetAllEndpoint';

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: void): Observable<RichNotification[]> {
        return this.httpClient.get<RichNotification[]>(this.url).pipe(
          map( val => val.sort((a, b) => (a.priority === b.priority) ? 0 : a.priority ? -1 : 1)),
        );
  }
}
