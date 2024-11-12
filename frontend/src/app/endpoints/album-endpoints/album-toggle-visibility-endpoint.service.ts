import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import { Observable } from 'rxjs';
import {buildHttpParams} from '../../helper/http-params.helper';

export interface AlbumVisibilityRequest {
  id: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumToggleVisibilityEndpointService implements MyBaseEndpointAsync<AlbumVisibilityRequest, void> {
  readonly url = `${MyConfig.api_address}/api/AlbumToggleVisibilityEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {
  }

  handleAsync(request: AlbumVisibilityRequest): Observable<void> {
        let params = buildHttpParams(request);
        return this.httpClient.get<void>(`${MyConfig.api_address}/api/AlbumToggleVisibilityEndpoint`, {params: params});
    }
}
