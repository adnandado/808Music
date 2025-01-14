import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { ClothesType, ProductType } from './product-create-endpoint.service';
import { MyConfig } from '../../my-config';

export interface ProductsGetTopWishlistedResponse {
  slug: string;
  id: number;
  title: string;
  quantity: number;
  price: number;
  isDigital: boolean;
  photoPaths: string[];
  bio: string;
  productType: ProductType;
  clothesType?: ClothesType;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsGetTopWishlistedService implements MyBaseEndpointAsync<void, ProductsGetTopWishlistedResponse[]> {
  private apiUrl = `${MyConfig.api_address}/api/ProductGetTopWishlistedEndpoint/api/ProductGetTopWishlisted
`;

  constructor(private httpClient: HttpClient) {}

  handleAsync() {
    return this.httpClient.get<ProductsGetTopWishlistedResponse[]>(this.apiUrl);
  }
}
