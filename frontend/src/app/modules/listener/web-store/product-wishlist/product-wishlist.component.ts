import { Component, Input, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  GetWishlistEndpointService,
  WishlistItem
} from '../../../../endpoints/products-endpoints/get-wishlist-endpoint.service';
import {
  RemoveProductFromWishlistService
} from '../../../../endpoints/products-endpoints/remove-item-from-wishlist-endpoint.service';

@Component({
  selector: 'app-product-wishlist',
  templateUrl: './product-wishlist.component.html',
  styleUrls: ['./product-wishlist.component.css']
})
export class ProductWishlistComponent implements OnInit {
  @Input()
  wishlistItems: WishlistItem[] = [];

  constructor(private wishlistService: GetWishlistEndpointService,
              private removeProductFromWishlistService : RemoveProductFromWishlistService) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    const userId = this.getUserIdFromToken();
    if (userId > 0) {
      const request = { userId: userId };
      this.wishlistService.handleAsync(request).subscribe({
        next: (response) => {
          console.log('Wishlist response:', response); // Proveri da li odgovor stiže
          if (response.success) {
            this.wishlistItems = response.wishlistItems;
          } else {
            console.error('Failed to load wishlist');
          }
        },
        error: (error) => console.error('Error fetching wishlist', error)
      });
    } else {
      console.error('User ID not found');
    }
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



  getDiscountPercentage(saleAmount: number): number {
    return Math.round(saleAmount * 100);
  }

  addToCart(productId: number): void {
    console.log(`Product ${productId} added to cart`);
  }

  removeFromWishlist(slug: string) {
    const userId = this.getUserIdFromToken();
    if (userId === null) {
      alert('You must be logged in to add items to the wishlist.');
      return;
    }

      this.removeProductFromWishlistService.removeProductFromWishlist({
        productSlug: slug,
        userId: userId
      }).subscribe(
        (response) => {
          if (response.success) {
            window.location.reload();

            console.log(response.message);
          } else {
            console.log(response.message);
          }
        },
        (error) => {
          console.error('Error removing from wishlist:', error);
        }
      );
  }
}
