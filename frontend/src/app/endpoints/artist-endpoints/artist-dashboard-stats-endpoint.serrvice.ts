import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface GetArtistDashboardRequest {
  artistId: number;
}

export interface FollowerStats {
  followerId: number;
  followerName: string;
  startedFollowing: string;
}

export interface ProductSalesStats {
  productId: number;
  productTitle: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface StreamStats {
  trackId: number;
  trackTitle: string;
  streamedAt: string;
}

export interface GetArtistDashboardResponse {
  success: boolean;
  errorMessage?: string;
  totalStreams: number;
  totalFollowers: number;
  totalRevenueAllProducts : number;
  lastFollowerDate?: string;
  followers: FollowerStats[];
  productSales: ProductSalesStats[];
  lastStreams: StreamStats[];
  artistName: string;
  followerGrowth: boolean;
  revenueGrowth : boolean;
  streamGrowth : boolean;
  revenueGrowthPercentage : number;
  streamGrowthPercentage : number;
  followerGrowthPercentage : number;


}

@Injectable({
  providedIn: 'root',
})
export class GetArtistDashboardEndpointService
  implements MyBaseEndpointAsync<GetArtistDashboardRequest, GetArtistDashboardResponse>
{
  readonly url = `${MyConfig.api_address}/api/GetArtistDashboardEndpoint`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: GetArtistDashboardRequest): Observable<GetArtistDashboardResponse> {
    if (!request.artistId) {
      throw new Error('ArtistId is required.');
    }

    return this.httpClient.get<GetArtistDashboardResponse>(`${this.url}?ArtistId=${request.artistId}`);
  }
}
