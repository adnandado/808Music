import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface GetWishlistRequest {
  userId: number;
}

export interface WishlistItem {
  productId: number;
  productTitle: string;

  slug : string;
  productPhoto?: string;
  originalPrice: number;
  discountedPrice: number;
  saleAmount : number;
  artistPfp : string;
  dateAdded : string;
  artistName : string;
}

export interface GetWishlistResponse {
  success: boolean;
  wishlistItems: WishlistItem[];
  userName: string;
}

@Injectable({
  providedIn: 'root',
})
export class GetWishlistEndpointService
  implements MyBaseEndpointAsync<GetWishlistRequest, GetWishlistResponse>
{
  readonly url = 'http://localhost:7000/api/GetWishlistEndpoint/api/wishlist';

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: GetWishlistRequest): Observable<GetWishlistResponse> {
    if (!request.userId) {
      throw new Error('UserId is required.');
    }

    return this.httpClient.get<GetWishlistResponse>(`${this.url}?UserId=${request.userId}`);
  }
}
