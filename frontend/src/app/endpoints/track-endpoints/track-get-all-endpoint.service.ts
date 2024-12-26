import { Injectable } from '@angular/core';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {TrackGetResponse} from './track-get-by-id-endpoint.service';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {buildHttpParams} from '../../helper/http-params.helper';
import {MyPagedList} from '../../services/auth-services/dto/my-paged-list';

export interface TrackGetAllRequest {
  pageNumber?: number;
  pageSize?: number;
  albumId?: number
  leadArtistId?: number
  featuredArtists?: number[]
  title?: string
  isReleased?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class TrackGetAllEndpointService implements MyBaseEndpointAsync<TrackGetAllRequest, MyPagedList<TrackGetResponse>> {
  readonly url = `${MyConfig.api_address}/api/TrackGetAllEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: TrackGetAllRequest): Observable<MyPagedList<TrackGetResponse>> {
      let params = buildHttpParams(request);
      return this.httpClient.get<MyPagedList<TrackGetResponse>>(this.url, {params});
    }
}
