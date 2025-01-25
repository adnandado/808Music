import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

export interface SpotlightRequest {
  albumId: number;
}

export interface SpotlightResponse {
  albumId: number;
  isHighlighted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumSpotlightEndpointService implements MyBaseEndpointAsync<SpotlightRequest, SpotlightResponse> {
  readonly url = `${MyConfig.api_address}/api/AlbumSpotlightEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: SpotlightRequest): Observable<SpotlightResponse> {
    return this.httpClient.post<SpotlightResponse>(this.url, request);
  }
}
