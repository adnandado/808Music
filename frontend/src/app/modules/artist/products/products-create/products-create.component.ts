import { Component } from '@angular/core';
import { ProductAddEndpointService, ProductAddRequest, ProductAddResponse } from '../../../../endpoints/products-endpoints/product-create-endpoint.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-create',
  templateUrl: './products-create.component.html',
  styleUrls: ['./products-create.component.css']
})
export class ProductsCreateComponent {

  productData: ProductAddRequest = {
    title: '',
    price: 0,
    quantity: 0,
    isDigital: false,
    photos: []
  };

  constructor(
    private productService: ProductAddEndpointService,
    private router: Router
  ) {}

  createProduct() {
    this.productService.handleAsync(this.productData).subscribe({
      next: (response: ProductAddResponse) => {
        this.router.navigate(['/product-list']);
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error creating product:", err);
        if (err.status) {
          console.error(`Error status: ${err.status}`);
          console.error(`Error message: ${err.message}`);
        }
        alert("There was an error creating the product.");
      }
    });
  }

  backToList() {
    this.router.navigate(['/product-list']);
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.productData.photos = Array.from(files);
    }
  }
}
