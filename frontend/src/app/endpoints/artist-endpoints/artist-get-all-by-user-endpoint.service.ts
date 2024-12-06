import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {ArtistSimpleDto} from '../../services/auth-services/dto/artist-dto';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root'
})
export class ArtistGetAllByUserEndpointService implements MyBaseEndpointAsync<void, ArtistSimpleDto[]> {
  private readonly url = `${MyConfig.api_address}/api/ArtistGetAllByUserEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: void): Observable<ArtistSimpleDto[]> {
        return this.httpClient.get<ArtistSimpleDto[]>(this.url);
    }
}
