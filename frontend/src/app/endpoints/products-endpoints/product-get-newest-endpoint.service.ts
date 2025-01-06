import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { ClothesType, ProductType } from './product-create-endpoint.service';

export interface ProductsGetNewestResponse {
  slug: string;
  title: string;
  quantity: number;
  price: number;
  isDigital: boolean;
  photoPaths: string[];
  saleAmount : number;

  bio: string;
  productType: ProductType;
  clothesType?: ClothesType;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsGetNewestService implements MyBaseEndpointAsync<void, ProductsGetNewestResponse[]> {
  private apiUrl = `http://localhost:7000/api/ProductGetNewestEndpoint/api/ProductGetNewest
`;

  constructor(private httpClient: HttpClient) {}

  handleAsync() {
    return this.httpClient.get<ProductsGetNewestResponse[]>(this.apiUrl);
  }
}
