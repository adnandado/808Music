import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { ClothesType, ProductType } from './product-create-endpoint.service';
import {MyConfig} from '../../my-config';

export interface ProductsOnSaleResponse {
  slug: string;
  title: string;
  quantity: number;
  price: number;
  isDigital: boolean;
  photoPaths: string[];
  saleAmount: number;

  bio: string;
  productType: ProductType;
  clothesType?: ClothesType;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsOnSaleService implements MyBaseEndpointAsync<void, ProductsOnSaleResponse[]> {
  private apiUrl = `${MyConfig.api_address}/api/ProductsOnSaleGetEndpoint/api/ProductsOnSale
`;

  constructor(private httpClient: HttpClient) {}

  handleAsync() {
    return this.httpClient.get<ProductsOnSaleResponse[]>(this.apiUrl);
  }
}
