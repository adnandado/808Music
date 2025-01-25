import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {MyConfig} from '../../my-config';
import {buildHttpParams} from '../../helper/http-params.helper';
import {AlbumInsertRequest} from './album-insert-or-update-endpoint.service';
import {MyPagedRequest} from '../../helper/my-paged-request';
import {MyPagedList} from '../../services/auth-services/dto/my-paged-list';
import {AlbumType} from './album-type-get-all-endpoint.service';


export interface AlbumPagedRequest {
  pageNumber?: number;
  pageSize?: number;
  artistId?: number;
  typeId?: number;
  isReleased?: boolean;
  title: string;
  featuredArtistId?: number;
  getTrackCount?: boolean;
  periodTo?: string;
  periodFrom?: string;
  sortByPopularity?: boolean;
}

export interface AlbumGetAllResponse {
  id: number;
  title: string;
  coverArt: string;
  releaseDate: string;
  artist: string;
  artistId: number;
  type: string;
  trackCount: number;
  isHighlighted: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AlbumGetAllEndpointService implements MyBaseEndpointAsync<AlbumPagedRequest, MyPagedList<AlbumGetAllResponse>> {
  readonly url = `${MyConfig.api_address}/api/AlbumGetAllEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {
  }

  handleAsync(request: AlbumPagedRequest): Observable<MyPagedList<AlbumGetAllResponse>> {
        const params = buildHttpParams(request);
        return this.httpClient.get<MyPagedList<AlbumGetAllResponse>>(this.url, {params});
    }
}
