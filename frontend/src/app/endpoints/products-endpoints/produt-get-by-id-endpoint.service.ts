import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface ProductGetResponse {
  id: number;
  title: string;
  quantity: number;
  price: number;
  isDigital: boolean;
  slug: string;
  photoPaths?: string[];
  artistPhoto?: string;
  artistName?: string;
  bio: string;
  discountedPrice : number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductGetByIdEndpointService implements MyBaseEndpointAsync<string, ProductGetResponse> {
  readonly url = `${MyConfig.api_address}/api/ProductGetByIdEndpoint`;

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: string): Observable<ProductGetResponse> {
    return this.httpClient.get<ProductGetResponse>(`${this.url}/${request}`);
  }
}

