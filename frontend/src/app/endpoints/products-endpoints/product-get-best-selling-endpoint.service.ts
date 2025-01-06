import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { ClothesType, ProductType } from './product-create-endpoint.service';

export interface ProductsGetBestSellingResponse {
  slug: string;
  title: string;
  quantity: number;
  price: number;
  isDigital: boolean;
  photoPaths: string[];
  saleAmount : number;
  Bio: string;
  productType: ProductType;
  clothesType?: ClothesType;
}
export interface Product {
  id: number;
  title: string;
  price: number;
  saleAmount: number;
  quantity: number;
  photoPaths: string[];
  bio: string;
  productType: string;
  clothesType?: string;
}
@Injectable({
  providedIn: 'root'
})
export class ProductsGetBestSellingService implements MyBaseEndpointAsync<void, ProductsGetBestSellingResponse[]> {
  private apiUrl = `http://localhost:7000/api/ProductGetBestSellingEndpoint/api/ProductGetBestSelling
`;

  constructor(private httpClient: HttpClient) {}

  handleAsync() {
    return this.httpClient.get<ProductsGetBestSellingResponse[]>(this.apiUrl);
  }
}
