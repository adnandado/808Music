import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UpdateShoppingCartService {
  private url = 'http://localhost:7000/api/UpdateShoppingCartEndpoint';

  constructor(private http: HttpClient) {}

  updateCart(request: { productId: number; userId: number; quantity: number }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(this.url, request);
  }
}
