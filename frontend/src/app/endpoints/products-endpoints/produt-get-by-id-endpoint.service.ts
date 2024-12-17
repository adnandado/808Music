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
}

@Injectable({
  providedIn: 'root'
})
export class ProductGetByIdEndpointService implements MyBaseEndpointAsync<string, ProductGetResponse> { // Promijenjeno na string za slug
  readonly url = `${MyConfig.api_address}/api/ProductGetByIdEndpoint`; // Promijenjeno na endpoint koji koristi slug

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: string): Observable<ProductGetResponse> {
    return this.httpClient.get<ProductGetResponse>(`${this.url}/${request}`);
  }
}
