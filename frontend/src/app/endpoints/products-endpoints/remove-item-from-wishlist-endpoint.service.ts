import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

export interface RemoveProductFromWishlistRequest {
  productSlug: string;
  userId: number;
}

export interface RemoveProductFromWishlistResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class RemoveProductFromWishlistService {
  private apiUrl = `${MyConfig.api_address}/api/RemoveProductFromWishlistEndpoint`;

  constructor(private httpClient: HttpClient) {}

  removeProductFromWishlist(request: RemoveProductFromWishlistRequest): Observable<RemoveProductFromWishlistResponse> {
    return this.httpClient.post<RemoveProductFromWishlistResponse>(this.apiUrl, request);
  }
}
