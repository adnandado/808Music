import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { ClothesType, ProductType } from './product-create-endpoint.service';

export interface ProductAutocompleteResponse {
  id: number;
  title: string;
  slug: string;
  price: number;
  saleAmount: number;
  quantity: number;
  photoPaths: string[];
  bio: string;
  productType: string;
  clothesType?: string;
}

export interface ProductAutocompleteRequest {
  keyword: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductAutocompleteService
  implements MyBaseEndpointAsync<ProductAutocompleteRequest, ProductAutocompleteResponse[]>
{
  // API endpoint URL with the correct path
  private apiUrl = 'http://localhost:7000/api/ProductAutocompleteEndpoint/api/ProductAutocomplete';

  constructor(private httpClient: HttpClient) {}

  handleAsync(request: ProductAutocompleteRequest): Observable<ProductAutocompleteResponse[]> {
    // Use URL with query parameter `keyword`
    return this.httpClient.get<ProductAutocompleteResponse[]>(`${this.apiUrl}?Keyword=${request.keyword}`);
  }
}
