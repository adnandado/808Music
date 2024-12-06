import { Injectable } from '@angular/core';
import {AlbumType} from './album-type-get-all-endpoint.service';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {MyConfig} from '../../my-config';

export interface Artist {
  id: number;
  name: string;
  bio: string;
  profilePhotoPath: string;
  profileBackgroundPath: string;
  followers: number;
}

export interface AlbumGetResponse {
  id: number;
  title: string;
  distributor: string;
  releaseDate: string;
  type: AlbumType;
  coverPath: string;
  numOfTracks: number;
  artist: Artist;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumGetByIdEndpointService implements MyBaseEndpointAsync<number, AlbumGetResponse> {
  readonly url = `${MyConfig.api_address}/api/AlbumGetByIdEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {

  }

  handleAsync(request: number): Observable<AlbumGetResponse> {
        return this.httpClient.get<AlbumGetResponse>(`${this.url}/${request}`);
    }
}
