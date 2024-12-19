import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductGetByIdEndpointService, ProductGetResponse } from '../../../../endpoints/products-endpoints/produt-get-by-id-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';

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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductGetByIdEndpointService
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

  prevSlide(): void {
    if (this.product?.photoPaths && this.product.photoPaths.length > 0) {
      this.currentSlide =
        (this.currentSlide - 1 + this.product.photoPaths.length) % this.product.photoPaths.length;
    }
  }

  changeSlide(index: number): void {
    this.currentSlide = index;
  }
}
