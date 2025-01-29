import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ProductByTypeService} from '../../../../endpoints/products-endpoints/products-by-type-endpoint.service';
import {MyConfig} from '../../../../my-config';
import {Product} from '../product.model';
import {MatSnackBar} from '@angular/material/snack-bar';
import {
  RemoveProductFromWishlistService
} from '../../../../endpoints/products-endpoints/remove-item-from-wishlist-endpoint.service';
import {
  AddProductToWishlistEndpointService,
  AddProductToWishlistRequest,
  AddProductToWishlistResponse
} from '../../../../endpoints/products-endpoints/add-to-wishlist-endpoint.service';
import {
  ProductIsOnWishlistService
} from '../../../../endpoints/products-endpoints/is-product-on-wishlist-endpoint.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-search-results',
  templateUrl: './bytype.component.html',
  styleUrls: ['./bytype.component.css'],
})
export class BytypeComponent implements OnInit {
  searchResults: any[] = [];
  productType: number | null = null;
  currentPage: number = 1;
  noResults: boolean = false;
  totalPages: number = 0;
  pageNumbers: number[] = [];
  pageSize: number = 10;
  totalResults: number = 0;
  wishlist: Set<string> = new Set();
  selectedSortOption: string = 'dateCreatedNewest';
  sortBy: string = 'dateCreatedNewest';
  sortOptions = [
    { value: 'dateCreatedNewest', label: 'Date created - Newest first' },
    { value: 'dateCreatedOldest', label: 'Date created - Oldest first' },
    { value: 'priceHighest', label: 'Price - Highest first' },
    { value: 'priceLowest', label: 'Price - Lowest first' },
    { value: 'saleHighest', label: 'Sale - Highest first' },
  ];

  productTypes = [
    { value: 0, label: 'Clothes' },
    { value: 1, label: 'Vinyls' },
    { value: 2, label: 'CDS' },
    { value: 3, label: 'Posters' },
    { value: 4, label: 'Accessories' },
    { value: 5, label: 'Miscellaneous' },
  ];

  constructor(
    private route: ActivatedRoute,
    private productByTypeService: ProductByTypeService,
    private router: Router, private snackBar : MatSnackBar,
    private removeProductFromWishlistService : RemoveProductFromWishlistService,
    private addProductToWishlist : AddProductToWishlistEndpointService,
    private productIsOnWishlistService: ProductIsOnWishlistService, private cdr : ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.calculatePagination();

    this.route.queryParams.subscribe((params) => {

      this.productType = params['productType'] ? +params['productType'] : null;
      this.currentPage = +params['page'] || 1;
      this.sortBy = params['sortBy'] || 'dateCreatedNewest';
      this.cdr.detectChanges();
      if (this.productType !== null) {
        this.fetchResults();
      }
    });
  }

  fetchResults(): void {
    if (this.productType !== null) {
      this.productByTypeService
        .getProductsByType(this.productType, this.currentPage, this.pageSize, this.sortBy)
        .subscribe({
          next: (results) => {
            this.searchResults = results.products;
            this.totalResults = results.total;
            this.noResults = this.searchResults.length === 0;
            this.checkWishlistStatus();
          },
          error: (err) => {
            console.error(err);
            this.noResults = true;
          },
        });
    }
  }
  getProductTypeLabel(typeValue: number | null): string {
    if (typeValue === null) return 'All Products';
    const type = this.productTypes.find((t) => t.value === typeValue);
    return type ? type.label : 'Unknown';
  }

  viewProduct(slug: string): void {
    this.router.navigate(['listener/product', slug]);
  }
  calculatePagination() {
    this.totalPages = Math.ceil(this.totalResults / this.pageSize);
    this.pageNumbers = [];

    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }

  checkWishlistStatus(): void {
    const userId = this.getUserIdFromToken();
    if (!userId) return;

    const requests = this.searchResults.map(product =>
      this.productIsOnWishlistService.handleAsync({ productSlug: product.slug, userId })
    );

    forkJoin(requests).subscribe(
      responses => {
        this.wishlist.clear();
        responses.forEach((response, index) => {
          if (response.isOnWishlist) {
            this.wishlist.add(this.searchResults[index].slug);
          }
        });
      },
      error => {
        console.error('Error checking wishlist status:', error);
      }
    );
  }

  searchByType(): void {
    this.currentPage = 1;
    this.updateUrlParams();
    this.fetchResults();
  }
  changeSortOrder(): void {
    if (this.selectedSortOption === 'dateCreatedNewest') {
      this.sortBy = 'datecreatednewest';
    } else if (this.selectedSortOption === 'dateCreatedOldest') {
      this.sortBy = 'datecreatedoldest';
    } else if (this.selectedSortOption === 'priceHighest') {
      this.sortBy = 'discountedpricehighest';
    } else if (this.selectedSortOption === 'priceLowest') {
      this.sortBy = 'discountedpricelowest';
    } else if (this.selectedSortOption === 'saleHighest') {
      this.sortBy = 'salelowest';
    }
this.currentPage = 1;
    this.updateUrlParams();
    this.fetchResults();
  }
  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.updateUrlParams();
    this.fetchResults();
  }

  updateUrlParams(): void {
    this.router.navigate(['/listener/product-type'], {
      queryParams: {
        productType: this.productType,
        page: this.currentPage,
        sortBy: this.sortBy,
      },
    });
  }
  onCategoryChange(newProductType: number): void {
    this.productType = newProductType;
    this.currentPage = 1;
    this.sortBy = 'title';
    this.updateUrlParams();
    this.fetchResults();
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
          this.snackBar.open('Product added to Wishlist successfully', 'Close', {
            duration: 1500,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });

        } else {
          alert('Error: ' + response.message);
        }
      },
      (error) => {
        alert('An error occurred: ' + error.message);
      }
    );
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
  private removeFromWishlist(slug: string) {
    const userId = this.getUserIdFromToken();

    this.removeProductFromWishlistService.removeProductFromWishlist({
      productSlug: slug,
      userId: userId
    }).subscribe(
      (response) => {
        if (response.success) {

          this.wishlist.delete(slug);
          this.snackBar.open('Product removed from Wishlist successfully', 'Close', {
            duration: 1500,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error('Error removing from wishlist:', error);
      }
    );
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
  protected readonly MyConfig = MyConfig;
}
