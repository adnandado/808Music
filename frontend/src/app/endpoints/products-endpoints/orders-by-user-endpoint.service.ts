import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MyConfig } from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly apiUrl = `${MyConfig.api_address}/api/OrderGetByUserEndpoint`;

  constructor(private http: HttpClient) {}

  getOrdersByUser(userId: number): Observable<GetOrderResponse> {
    const params = new HttpParams().set('UserId', userId.toString());
    return this.http.get<GetOrderResponse>(this.apiUrl, { params });
  }
}

export interface GetOrderResponse {
  success: boolean;
  message?: string;
  userName: string;
  orders: OrderItem[];
}

export interface OrderItem {
  orderId: number;
  orderCode: string;
  status: string;
  totalPrice: number;
  dateAdded: string;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
  photoPath?: string;
}
