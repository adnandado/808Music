import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface AddProductToWishlistRequest {
    userId: number;
  productSlug: string;
}

export interface AddProductToWishlistResponse {
    success: boolean;
    message: string;
}

@Injectable({
    providedIn: 'root',
})
export class AddProductToWishlistEndpointService
    implements MyBaseEndpointAsync<AddProductToWishlistRequest, AddProductToWishlistResponse>
{
    readonly url = `${MyConfig.api_address}/api/AddProductToWishlistEndpoint`;

    constructor(private httpClient: HttpClient) {}

    handleAsync(request: AddProductToWishlistRequest): Observable<AddProductToWishlistResponse> {
        if (!request.userId || !request.productSlug) {
            return throwError(() => new Error('ProductId and UserId are required.'));
        }

        return this.httpClient.post<AddProductToWishlistResponse>(this.url, request);
    }
}
