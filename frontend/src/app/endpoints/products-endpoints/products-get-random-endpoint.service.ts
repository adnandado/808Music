import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { ClothesType, ProductType } from './product-create-endpoint.service';

export interface ProductsGetRandomResponse {
  slug: string;
  id: number;
  title: string;
  quantity: number;
  price: number;
  isDigital: boolean;
  photoPaths: string[];
  Bio: string;
  productType: ProductType;
  clothesType?: ClothesType;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsGetRandomService implements MyBaseEndpointAsync<void, ProductsGetRandomResponse[]> {
  private apiUrl = `http://localhost:7000/api/ProductGetRandomEndpoint/api/ProductGetRandom
`;

  constructor(private httpClient: HttpClient) {}

  handleAsync() {
    return this.httpClient.get<ProductsGetRandomResponse[]>(this.apiUrl);
  }
}
