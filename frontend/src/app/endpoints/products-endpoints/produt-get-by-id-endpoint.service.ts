import { Injectable } from '@angular/core';
import {MyBaseEndpointAsync} from '../../helper/my-base-endpoint-async.interface';
import { Observable } from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {MyAuthService} from '../../services/auth-services/my-auth.service';
import {MyConfig} from '../../my-config';

export interface ProductGetResponse {
  id: number;
  title: string;
  quantity: number;
  price: number;
  isDigital: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProductGetByIdEndpointService implements MyBaseEndpointAsync<number, ProductGetResponse> {
  readonly url = `${MyConfig.api_address}/api/ProductGetByIdEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {

  }

  handleAsync(request: number): Observable<ProductGetResponse> {
    return this.httpClient.get<ProductGetResponse>(`${this.url}/${request}`);
  }
}
