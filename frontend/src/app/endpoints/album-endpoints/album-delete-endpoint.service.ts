import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumDeleteEndpointService implements MyBaseEndpointAsync<number, void> {
  readonly url = `${MyConfig.api_address}/api/AlbumDeleteEndpoint`;

  constructor(private httpClient: HttpClient) {

  }

  handleAsync(request: number): Observable<void> {
    return this.httpClient.get<void>(`${this.url}/${request}`)
    }
}
