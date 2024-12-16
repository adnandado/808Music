import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TrackDeleteEndpointService implements MyBaseEndpointAsync<number, string> {
  readonly url = `${MyConfig.api_address}/api/TrackDeleteEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(id: number): Observable<string> {
        return this.httpClient.delete(this.url + "/" + id, {responseType: 'text'});
    }
}
