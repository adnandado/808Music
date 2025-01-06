import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {MyConfig} from '../../my-config';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArtistDetailResponse {
  id: number;
  name: string;
  bio: string;
  profilePhotoPath: string;
  profileBackgroundPath: string;
  followers: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArtistGetByIdEndpointService implements MyBaseEndpointAsync<number, ArtistDetailResponse> {
  readonly url = `${MyConfig.api_address}/api/ArtistGetByIdEndpoint`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: number): Observable<ArtistDetailResponse> {
        return this.httpClient.get<ArtistDetailResponse>(`${this.url}/${request}`);
  }


}
