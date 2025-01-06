import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductGetByIdEndpointService, ProductGetResponse } from '../../../../endpoints/products-endpoints/produt-get-by-id-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AddToShoppingCartEndpointService
} from '../../../../endpoints/products-endpoints/add-to-shopping-cart-endpoint.service';
import {
  AddProductToWishlistEndpointService, AddProductToWishlistRequest, AddProductToWishlistResponse
} from '../../../../endpoints/products-endpoints/add-to-wishlist-endpoint.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: ProductGetResponse | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  currentSlide: number = 0;
  quantity: number = 1;
  constructor(
    private route: ActivatedRoute,
    private productService: ProductGetByIdEndpointService,
  private addToShoppingCartService: AddToShoppingCartEndpointService,
  private addProductToWishlist: AddProductToWishlistEndpointService,

) {}

  ngOnInit(): void {
    const productSlug = this.route.snapshot.paramMap.get('slug');
    if (productSlug) {
      this.loadProduct(productSlug);
    } else {
      this.errorMessage = 'Invalid product slug';
    }
  }

  loadProduct(slug: string): void {
    this.productService.handleAsync(slug).subscribe({
      next: (data) => {
        if (data) {
          this.product = data;
        } else {
          this.errorMessage = 'No product data available';
        }
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Failed to load product';
        console.error(err);
        this.loading = false;
      }
    });
  }

  nextSlide(): void {
    if (this.product?.photoPaths && this.product.photoPaths.length > 0) {
      this.currentSlide = (this.currentSlide + 1) % this.product.photoPaths.length;
    }
  }
  addToCart(): void {
    const userId = this.getUserIdFromToken();

    if (this.product && this.quantity > 0 && userId !== null) {
      const request = {
        productId: this.product.id,
        userId: userId,
        quantity: this.quantity
      };

      this.addToShoppingCartService.handleAsync(request).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Product added to cart:', response.message);
            window.location.reload();
          } else {
            console.error('Failed to add product to cart:', response.message);
          }
        },
        error: (err) => {
          console.error('Error adding to cart', err);
        }
      });
    } else {
      console.error('Invalid user ID or product quantity.');
    }

  }
  prevSlide(): void {
    if (this.product?.photoPaths && this.product.photoPaths.length > 0) {
      this.currentSlide =
        (this.currentSlide - 1 + this.product.photoPaths.length) % this.product.photoPaths.length;
    }
  }

  changeSlide(index: number): void {
    this.currentSlide = index;
  }
  private getUserIdFromToken(): number | null {
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

  addToWishlist() {
    const userId = this.getUserIdFromToken();
    if (userId === null) {
      alert('You must be logged in to add items to the wishlist.');
      return;
    }
    if (this.product!.slug === null) {
      alert('You must be logged in to add items to the wishlist.');
      return;
    }
    const request: AddProductToWishlistRequest = {
      productSlug: this.product!.slug,
      userId: userId
    };
    this.addProductToWishlist.handleAsync(request).subscribe(
      (response: AddProductToWishlistResponse) => {
        if (response.success) {
          window.location.reload();

        } else {
          alert('Error: ' + response.message);
        }
      },
      (error) => {
        alert('An error occurred: ' + error.message);
      }
    );
  }
}
