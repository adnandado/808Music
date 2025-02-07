import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';
import {buildHttpParams} from '../../helper/http-params.helper';
import {HttpClient} from '@angular/common/http';

export interface TrackStreamRequest {
  trackId: number;
  jwt: string;
  artistMode?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TrackStreamEndpointService implements MyBaseEndpointAsync<TrackStreamRequest, ArrayBuffer> {
  readonly url = `${MyConfig.api_address}/api/TrackStreamEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: TrackStreamRequest): Observable<ArrayBuffer> {
    let params = buildHttpParams(request);
    return this.httpClient.get(this.url, {params: params, responseType: "arraybuffer"});
  }
}
