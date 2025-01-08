import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ProductsSearchService} from '../../../../endpoints/products-endpoints/search-by-title-endpoint.service';

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

  pageSize: number = 10;
  totalResults: number = 0;

  sortBy: string = 'dateCreatedNewest';

  constructor(
    private route: ActivatedRoute,
    private productsSearchService: ProductsSearchService,
    private router: Router
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

  searchProducts(keyword: string) {
    this.keyword = keyword;
    this.currentPage = 1;
    this.updateUrlParams();
    this.fetchResults();
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
}
