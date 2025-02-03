import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface GetArtistBioRequest {
  artistId: number;
}

export interface GetArtistBioResponse {
  success: boolean;
  errorMessage?: string;
  artistName: string;
  streamCount: number;
  musicRank: number;
  shopRank: number;
  bio: string;
  backgroundPath: string;
  monthlyListeners: number;
}

@Injectable({
  providedIn: 'root',
})
export class GetArtistBioEndpointService
  implements MyBaseEndpointAsync<GetArtistBioRequest, GetArtistBioResponse>
{
  readonly url = `${MyConfig.api_address}/api/ArtistGetBioEndpoint`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: GetArtistBioRequest): Observable<GetArtistBioResponse> {
    if (!request.artistId) {
      throw new Error('ArtistId is required.');
    }

    return this.httpClient.get<GetArtistBioResponse>(`${this.url}?ArtistId=${request.artistId}`);
  }
}
