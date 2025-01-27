import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ProductsSearchService} from '../../../../endpoints/products-endpoints/search-by-title-endpoint.service';
import {MyConfig} from '../../../../my-config';
import {Product} from '../product.model';
import {debounceTime, switchMap} from 'rxjs/operators';
import {
  ProductAutocompleteService
} from '../../../../endpoints/products-endpoints/product-autocomplete-endpoint.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-search-results',
  templateUrl: './store-search.component.html',
  styleUrls: ['./store-search.component.css'],
})
export class StoreSearchComponent implements OnInit {
  searchResults: any[] = [];
  keyword: string = '';
  currentPage: number = 1;
  noResults: boolean = false;
  filteredProducts: Product[] = [];
  searchControl = new FormControl();

  pageSize: number = 10;
  totalResults: number = 0;

  sortBy: string = 'dateCreatedNewest';

  constructor(
    private route: ActivatedRoute,
    private productsSearchService: ProductsSearchService,
    private router: Router, private searchService : ProductAutocompleteService,

  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.keyword = params['keyword'] || '';
      this.currentPage = +params['page'] || 1;
      this.sortBy = params['sortBy'] || 'title';

      if (this.keyword || this.sortBy) {
        this.fetchResults();
      }
    });

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
  }

  fetchResults(): void {
    this.productsSearchService
      .searchProducts(this.keyword, this.sortBy, this.currentPage, this.pageSize)
      .subscribe({
        next: (results) => {
          this.searchResults = results.products;
          this.totalResults = results.total;
          this.noResults = this.searchResults.length === 0;
        },
        error: (err) => {
          console.error(err);
          this.noResults = true;
        },
      });
  }


  viewProduct(slug: string): void {
    this.router.navigate(['listener/product', slug]);
  }

  searchProducts(keyword: string): void {
    if (!keyword.trim()) {
      return;
    }
    this.router.navigate(['/listener/product-search'], {
      queryParams: { keyword },
    });
  }

  changePage(newPage: number): void {
    this.currentPage = newPage;
    this.updateUrlParams();
    this.fetchResults();
  }

  changeSortOrder(): void {
    if (this.sortBy === 'dateCreatedNewest') {
      this.sortBy = 'datecreatednewest';
    } else if (this.sortBy === 'dateCreatedOldest') {
      this.sortBy = 'datecreatedoldest';
    } else if (this.sortBy === 'priceHighest') {
      this.sortBy = 'discountedpricehighest';
    } else if (this.sortBy === 'priceLowest') {
      this.sortBy = 'discountedpricelowest';
    } else if (this.sortBy === 'saleHighest') {
      this.sortBy = 'salelowest';
    }

    this.updateUrlParams();
    this.fetchResults();
  }
  updateCalculatedPrice(product: Product): string {
    const calculatedPrice = product.saleAmount > 0
      ? product.price * (1 - product.saleAmount)
      : product.price;
    return calculatedPrice.toFixed(2);
  }
  updateUrlParams(): void {
    this.router.navigate(['/listener/product-search'], {
      queryParams: {
        keyword: this.keyword,
        page: this.currentPage,
        sortBy: this.sortBy,
      },
    });
  }

  isOnWishlist(product: any) {
    return false;
  }

  toggleWishlist($event: MouseEvent, product: any) {

  }

  protected readonly MyConfig = MyConfig;
}
