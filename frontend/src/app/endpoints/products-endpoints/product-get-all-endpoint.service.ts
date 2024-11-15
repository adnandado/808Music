import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MyConfig} from '../../my-config';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';

export interface ProductsGetAllResponse {
  id: number;
  title: string;
  quantity: number;
  price: number;
  isDigital: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsGetAllService implements MyBaseEndpointAsync<void, ProductsGetAllResponse[]> {
  private apiUrl = `${MyConfig.api_address}/api/ProductGetAll`;

  constructor(private httpClient: HttpClient) {
  }

  handleAsync() {
    return this.httpClient.get<ProductsGetAllResponse[]>(`${this.apiUrl}`);
  }
}
