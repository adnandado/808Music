import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { GetShoppingCartService } from '../../../endpoints/products-endpoints/get-shopping-cart-endpoint.service';
import { RemoveFromShoppingCartService } from '../../../endpoints/products-endpoints/remove-item-from-shopping-cart-endpoint.service';
import { UpdateShoppingCartService } from '../../../endpoints/products-endpoints/update-shopping-cart-endpoint.service';
import { MyConfig } from '../../../my-config';
import {Router} from '@angular/router';
import {CartUpdateService} from './shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css'],
})
export class ShoppingCartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  isCartVisible = false;

  constructor(
    private getCartService: GetShoppingCartService,
    private removeFromCartService: RemoveFromShoppingCartService,
    private updateShoppingCartService: UpdateShoppingCartService,
    private router : Router,
    private cdRef : ChangeDetectorRef,
    private cartUpdateService: CartUpdateService,
  ) {}

  ngOnInit(): void {
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.loadCart(userId);
    } else {
      console.error('User not authenticated');
    }
    this.cartUpdateService.cartUpdated$.subscribe(() => {
      const userId = this.getUserIdFromToken();
      if (userId) {
        this.loadCart(userId);
      }
    });
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


  loadCart(userId: number): void {
    this.getCartService.getCart(userId).subscribe((response) => {
      if (Array.isArray(response.cartItems)) {
        this.cartItems = response.cartItems;
        this.calculateTotalPrice();
        this.cdRef.detectChanges();
      } else {
        console.error('Expected an array for cartItems, but received:', response.cartItems);
        this.cartItems = [];
        this.totalPrice = 0;
        this.cdRef.detectChanges();
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
  }

  updateQuantity(productId: number, quantity: number): void {
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.updateShoppingCartService.updateCart({ productId, userId, quantity }).subscribe(() => {
        this.loadCart(userId);
      });
    }
  }

  removeItem(productId: number): void {
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.removeFromCartService.removeFromCart({ productId, userId }).subscribe(() => {
        this.loadCart(userId);
      });
    }
  }

  protected readonly MyConfig = MyConfig;

  proceedToCheckout() {
    this.router.navigate(['listener/checkout']);
  }
}
