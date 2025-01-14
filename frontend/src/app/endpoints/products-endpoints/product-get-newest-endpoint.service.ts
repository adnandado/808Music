import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { ClothesType, ProductType } from './product-create-endpoint.service';
import {MyConfig} from '../../my-config';

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
  private apiUrl = `${MyConfig.api_address}/api/ProductGetNewestEndpoint/api/ProductGetNewest
`;

  constructor(private httpClient: HttpClient) {}

  handleAsync() {
    return this.httpClient.get<ProductsGetNewestResponse[]>(this.apiUrl);
  }
}
