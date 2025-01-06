import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RemoveFromShoppingCartService {
  private url = 'http://localhost:7000/api/RemoveFromShoppingCartEndpoint';

  constructor(private http: HttpClient) {}

  removeFromCart(request: { productId: number; userId: number }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(this.url, request);
  }
}
