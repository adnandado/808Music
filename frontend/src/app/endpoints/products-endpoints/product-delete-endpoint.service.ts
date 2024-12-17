import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { MyConfig } from '../../my-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDeleteEndpointService implements MyBaseEndpointAsync<string, void> {
  readonly url = `${MyConfig.api_address}/api/ProductDeleteEndpoint`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(slug: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.url}/${slug}`);
  }
}
