import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {AlbumGetAllResponse} from './album-get-all-endpoint.service';
import {MyConfig} from '../../my-config';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumGetSpotlightEndpointService implements MyBaseEndpointAsync<number, AlbumGetAllResponse> {
  private readonly url = `${MyConfig.api_address}/api/AlbumGetSpotlightEndpoint`

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: number): Observable<AlbumGetAllResponse> {
    return this.httpClient.get<AlbumGetAllResponse>(`${this.url}/${request}`);
  }
}
