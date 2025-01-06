import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

export interface IsProductOnWishlistRequest {
  productSlug: string;
  userId: number;
}

export interface IsProductOnWishlistResponse {
  isOnWishlist: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductIsOnWishlistService {
  private apiUrl = `${MyConfig.api_address}/api/IsProductOnWishlistEndpoint`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: IsProductOnWishlistRequest): Observable<IsProductOnWishlistResponse> {
    const params = new HttpParams()
      .set('ProductSlug', request.productSlug)
      .set('UserId', request.userId.toString());

    return this.httpClient.get<IsProductOnWishlistResponse>(this.apiUrl, { params });
  }
}
