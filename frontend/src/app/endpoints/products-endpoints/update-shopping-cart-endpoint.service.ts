import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class UpdateShoppingCartService {
  private url = `${MyConfig.api_address}/api/UpdateShoppingCartEndpoint`;

  constructor(private http: HttpClient) {}

  updateCart(request: { productId: number; userId: number; quantity: number }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(this.url, request);
  }
}
