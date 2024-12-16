import { Injectable } from '@angular/core';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


export interface TrackInsertRequest {
  id?: number
  title: string;
  trackFile?: File
  isExplicit: boolean;
  albumId: number;
  artistIds: number[];
}

export interface TrackInsertResponse {
  id: number;
  title: string;
  mainArtist: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrackInsertOrUpdateEndpointService implements MyBaseEndpointAsync<TrackInsertRequest, TrackInsertResponse> {
  readonly url = `${MyConfig.api_address}/api/TrackInsertOrUpdateEndpoint`;

  constructor(private httpClient: HttpClient) {

  }

  handleAsync(request: TrackInsertRequest): Observable<TrackInsertResponse> {
        let formData = new FormData();
        if(request.id !== undefined)
        {
          formData.append("id", request.id.toString());
        }
        formData.append("title", request.title);
        formData.append("isExplicit", request.isExplicit.toString());
        formData.append("albumId", request.albumId.toString());
        for (const aId of request.artistIds) {
          formData.append("artistIds", aId.toString());
        }

        if(request.trackFile !== undefined) {
          formData.append("trackFile", request.trackFile);
        }
        return this.httpClient.post<TrackInsertResponse>(this.url, formData);
    }


}
