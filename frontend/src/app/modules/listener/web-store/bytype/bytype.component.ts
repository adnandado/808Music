import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {ProductByTypeService} from '../../../../endpoints/products-endpoints/products-by-type-endpoint.service';

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

  sortBy: string = 'dateCreatedNewest';

  // Lista tipova proizvoda
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
    private router: Router
  ) {}

  ngOnInit() {
    this.calculatePagination();

    this.route.queryParams.subscribe((params) => {

      this.productType = params['productType'] ? +params['productType'] : null;
      this.currentPage = +params['page'] || 1;
      this.sortBy = params['sortBy'] || 'dateCreatedNewest';

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
          },
          error: (err) => {
            console.error(err);
            this.noResults = true;
          },
        });
    }
  }
  getProductTypeLabel(typeValue: number | null): string {
    if (typeValue === null) return 'All Products'; // Ili neka zadana vrijednost
    const type = this.productTypes.find((t) => t.value === typeValue);
    return type ? type.label : 'Unknown';
  }

  viewProduct(slug: string): void {
    this.router.navigate(['listener/product', slug]);
  }
  calculatePagination() {
    this.totalPages = Math.ceil(this.totalResults / this.pageSize);  // Ukupan broj stranica
    this.pageNumbers = [];

    // Napravi niz brojeva stranica
    for (let i = 1; i <= this.totalPages; i++) {
      this.pageNumbers.push(i);
    }
  }


  searchByType(): void {
    this.currentPage = 1; // Resetiraj na prvu stranicu
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


  toggleWishlist($event: MouseEvent, product: any) {

  }

  isOnWishlist(product: any) {
    return false;
  }
}
