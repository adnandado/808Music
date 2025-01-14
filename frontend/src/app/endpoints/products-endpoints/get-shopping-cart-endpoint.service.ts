import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class GetShoppingCartService {
  private url = `${MyConfig.api_address}/api/GetShoppingCartEndpoint`;

  constructor(private http: HttpClient) {}

  getCart(userId: number): Observable<{ success: boolean; cartItems: { productId: number; productTitle: string; productPhoto: string | null; quantity: number; price: number }[] }> {
    return this.http.get<{ success: boolean; cartItems: { productId: number; productTitle: string; productPhoto: string | null; discountedPrice : number; quantity: number; price: number }[] }>(`${this.url}?userId=${userId}`);
  }
}
