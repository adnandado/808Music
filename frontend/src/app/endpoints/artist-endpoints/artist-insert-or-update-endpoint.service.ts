import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';

export interface ArtistInsertRequest {
  id?: number;
  name: string;
  bio: string;
  profilePhoto?: File
  profileBackground?: File
}

export interface ArtistInsertResponse {
  name: string;
  bio: string;
  profilePhotoPath: string;
  profileBackgroundPath: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArtistInsertOrUpdateEndpointService implements MyBaseEndpointAsync<ArtistInsertRequest, ArtistInsertResponse> {
  private url = `${MyConfig.api_address}/api/ArtistInsertOrUpdateEndpoint`;
  constructor(private httpClient: HttpClient) {
  }

  handleAsync(request: ArtistInsertRequest): Observable<ArtistInsertResponse> {
        let frmData = new FormData();
        if(request.id !== undefined){
          frmData.append('id', request.id.toString());
        }
        frmData.append('name', request.name);
        frmData.append('bio', request.bio);
        if(request.profilePhoto !== undefined){
          frmData.append('profilePhoto', request.profilePhoto!);
        }
        if(request.profileBackground !== undefined)
        {
          frmData.append('profileBackground', request.profileBackground!);
        }

        return this.httpClient.post<ArtistInsertResponse>(this.url, frmData);
    }
}
