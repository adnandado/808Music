import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:7000/api/RemoveProductFromWishlistEndpoint';

  constructor(private httpClient: HttpClient) {}

  removeProductFromWishlist(request: RemoveProductFromWishlistRequest): Observable<RemoveProductFromWishlistResponse> {
    return this.httpClient.post<RemoveProductFromWishlistResponse>(this.apiUrl, request);
  }
}
