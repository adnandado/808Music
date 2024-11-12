import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import {MyAuthService} from '../../services/auth-services/my-auth.service';


export interface AlbumType {
  id: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumTypeGetAllEndpointService implements MyBaseEndpointAsync<null, AlbumType[]> {
  readonly url = `${MyConfig.api_address}/api/AlbumTypeGetAllEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {
  }

  handleAsync(request: null): Observable<AlbumType[]> {
        return this.httpClient.get<AlbumType[]>(`${MyConfig.api_address}/api/AlbumTypeGetAllEndpoint`);
    }
}
