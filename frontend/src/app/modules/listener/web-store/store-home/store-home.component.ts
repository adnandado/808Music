import { Component, OnInit } from '@angular/core';
import { ProductsGetRandomService } from '../../../../endpoints/products-endpoints/products-get-random-endpoint.service';
import { ProductsGetNewestService } from '../../../../endpoints/products-endpoints/product-get-newest-endpoint.service';
import { ProductsGetBestSellingService } from '../../../../endpoints/products-endpoints/product-get-best-selling-endpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product.model';
import { ProductsOnSaleService } from '../../../../endpoints/products-endpoints/products-on-sale-endpoint.service';
import { AddProductToWishlistEndpointService, AddProductToWishlistRequest, AddProductToWishlistResponse } from '../../../../endpoints/products-endpoints/add-to-wishlist-endpoint.service';
import { ProductIsOnWishlistService } from '../../../../endpoints/products-endpoints/is-product-on-wishlist-endpoint.service';
import { forkJoin } from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {
  ProductAutocompleteService
} from '../../../../endpoints/products-endpoints/product-autocomplete-endpoint.service';
import {
  RemoveProductFromWishlistService
} from '../../../../endpoints/products-endpoints/remove-item-from-wishlist-endpoint.service';
import {MyConfig} from '../../../../my-config';

@Component({
  selector: 'app-web-store',
  templateUrl: './store-home.component.html',
  styleUrls: ['./store-home.component.css']
})
export class WebStoreComponent implements OnInit {
  bestSellingProducts: Product[] = [];
  randomProducts: Product[] = [];
  newestProducts: Product[] = [];
  onSaleProducts: Product[] = [];
  loading: boolean = true;
  wishlist: Set<string> = new Set();
  keyword: string | null = '';
  isWishlistItem: boolean = false;
  searchControl = new FormControl();
  filteredProducts: Product[] = [];
  constructor(
    private randomProductService: ProductsGetRandomService,
    private newestProductService: ProductsGetNewestService,
    private bestSellingProductService: ProductsGetBestSellingService,
    private productsOnSaleService: ProductsOnSaleService,
    private route: ActivatedRoute,
    private router: Router,
    private addProductToWishlist: AddProductToWishlistEndpointService,
    private productIsOnWishlistService: ProductIsOnWishlistService,
    private searchService : ProductAutocompleteService,
    private removeProductFromWishlistService : RemoveProductFromWishlistService
  ) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((searchTerm: string) => {
        if (!searchTerm.trim()) {
          return [];
        }
        const request = { keyword: searchTerm };
        return this.searchService.handleAsync(request);
      })
    ).subscribe(
      (products) => {
        this.filteredProducts = products;
      },
      (error) => {
        console.error('Error during product search:', error);
        this.filteredProducts = [];
      }
    );
    forkJoin([
      this.newestProductService.handleAsync(),
      this.bestSellingProductService.handleAsync(),
      this.randomProductService.handleAsync(),
      this.productsOnSaleService.handleAsync()
    ]).subscribe(
      ([newestData, bestSellingData, randomData, onSaleData]) => {
        this.newestProducts = this.mapProducts(newestData);
        this.bestSellingProducts = this.mapProducts(bestSellingData);
        this.randomProducts = this.mapProducts(randomData);
        this.onSaleProducts = this.mapProducts(onSaleData);

        this.checkWishlistForAllProducts();

        this.loading = false;
      },
      (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    );

    this.route.queryParamMap.subscribe(params => {
      this.keyword = params.get('keyword');
    });
  }

  mapProducts(data: any[]): Product[] {
    return data.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      slug: item.slug,
      saleAmount: item.saleAmount,
      quantity: item.quantity,
      photoPaths: item.photoPaths,
      bio: item.bio,
      productType: item.productType,
      clothesType: item.clothesType
    }));
  }

  checkWishlistForAllProducts(): void {
    const allProducts = [
      ...this.newestProducts,
      ...this.bestSellingProducts,
      ...this.randomProducts,
      ...this.onSaleProducts
    ];

    allProducts.forEach(product => {
      this.checkIfOnWishlist(product);
    });
  }

  checkIfOnWishlist(product: Product): void {
    const userId = this.getUserIdFromToken();
    if (userId === null) {
      alert('You must be logged in to check if the product is on your wishlist.');
      return;
    }

    const request = {
      productSlug: product.slug,
      userId: userId,
    };

    this.productIsOnWishlistService.handleAsync(request).subscribe(
      (response) => {
        if (response.isOnWishlist) {
          this.wishlist.add(product.slug);
        }
      },
      (error) => {
        console.error('Error checking wishlist:', error);
      }
    );
  }

  viewProduct(slug: string): void {
    this.router.navigate(['listener/product', slug]);
  }

  toggleWishlist(event: MouseEvent, product: Product): void {
    event.stopPropagation();
    const userId = this.getUserIdFromToken();
    if (userId === null) {
      alert('You must be logged in to add items to the wishlist.');
      return;
    }
    if (this.isOnWishlist(product)) {
      this.removeFromWishlist(product.slug);
    } else {
      this.addToWish(product.slug);
    }
  }


  isOnWishlist(product: Product): boolean {
    return this.wishlist.has(product.slug);
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


  private addToWish(slug: string) {
    const userId = this.getUserIdFromToken();
    if (userId === null) {
      alert('You must be logged in to add items to the wishlist.');
      return;
    }
    const request: AddProductToWishlistRequest = {
      productSlug: slug,
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

  updateCalculatedPrice(product: Product): string {
    const calculatedPrice = product.saleAmount > 0
      ? product.price * (1 - product.saleAmount)
      : product.price;
    return calculatedPrice.toFixed(2); // Formatiranje na dvije decimale
  }

  searchProducts(keyword: string): void {
    if (!keyword.trim()) {
      return; // Izbjegavaj slanje prazne ključne riječi
    }
    this.router.navigate(['/listener/product-search'], {
      queryParams: { keyword },
    });
  }

  private removeFromWishlist(slug: string) {
    const userId = this.getUserIdFromToken();

    this.removeProductFromWishlistService.removeProductFromWishlist({
      productSlug: slug,
      userId: userId
    }).subscribe(
      (response) => {
        if (response.success) {

          this.wishlist.delete(slug);
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error('Error removing from wishlist:', error);
      }
    );
  }

  protected readonly MyConfig = MyConfig;
}
