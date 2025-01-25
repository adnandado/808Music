import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { ProductGetByIdEndpointService, ProductGetResponse } from '../../../../endpoints/products-endpoints/produt-get-by-id-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AddToShoppingCartEndpointService
} from '../../../../endpoints/products-endpoints/add-to-shopping-cart-endpoint.service';
import {
  AddProductToWishlistEndpointService, AddProductToWishlistRequest, AddProductToWishlistResponse
} from '../../../../endpoints/products-endpoints/add-to-wishlist-endpoint.service';
import {MyConfig} from '../../../../my-config';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('profileImageAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
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
    private router : Router,

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
          console.log(data);
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
window.location.reload();      } else {
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
this.ngOnInit();
        } else {
          alert('Error: ' + response.message);
        }
      },
      (error) => {
        alert('An error occurred: ' + error.message);
      }
    );
  }

  protected readonly MyConfig = MyConfig;

  goToArtistPage() {
    this.router.navigate(['/listener/profile/4'])
  }
}
