import {Component, OnInit} from '@angular/core';
import {
  GetOrderResponse,
  OrderItem,
  OrderService
} from '../../../endpoints/products-endpoints/orders-by-user-endpoint.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MyConfig} from '../../../my-config';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit{
  orders: OrderItem[] = [];
  userName: string = '';
  errorMessage: string | null = null;
  userId = 0;
  constructor(private _router : Router, private activatedRoute : ActivatedRoute, private orderService : OrderService ){}

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();
  this.loadOrders(this.userId );
  }
  private getUserIdFromToken(): number {
    let authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
      authToken = localStorage.getItem('authToken');
    }

    if (!authToken) {
      return 0;
    }

    try {
      const parsedToken = JSON.parse(authToken);
      return parsedToken.userId;
    } catch (error) {
      console.error('Error parsing authToken:', error);
      return 0;
    }
  }
  loadOrders(userId: number): void {
    this.orderService.getOrdersByUser(userId).subscribe({
      next: (response: GetOrderResponse) => {
        if (response.success) {
          this.orders = response.orders;
          this.userName = response.userName;
          this.errorMessage = null;
        } else {
          this.errorMessage = response.message || 'Nije moguće dohvatiti narudžbe.';
        }
      },
      error: (error) => {
        console.error('Greška pri dohvaćanju narudžbi:', error);
        this.errorMessage = 'Došlo je do greške na serveru.';
      },
    });
  }

  protected readonly MyConfig = MyConfig;
}
