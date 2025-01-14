import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class RemoveFromShoppingCartService {
  private url = `${MyConfig.api_address}/api/RemoveFromShoppingCartEndpoint`;

  constructor(private http: HttpClient) {}

  removeFromCart(request: { productId: number; userId: number }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(this.url, request);
  }
}
