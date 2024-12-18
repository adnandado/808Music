import { Component, OnInit } from '@angular/core';
import { ProductsGetAllService, ProductsGetAllResponse } from '../../../../endpoints/products-endpoints/product-get-all-endpoint.service';
import { Router } from '@angular/router';
import { ProductDeleteEndpointService } from '../../../../endpoints/products-endpoints/product-delete-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductUpdateEndpointService, ProductUpdateResponse } from '../../../../endpoints/products-endpoints/product-update-endpoint.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: ProductsGetAllResponse[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  selectedFiles: FileList | null = null;
  isEditing: { [key: string]: boolean } = {};
  newImagePreview: string | null = null;

  constructor(
    private productService: ProductsGetAllService,
    private updateService: ProductUpdateEndpointService,
    private deleteService: ProductDeleteEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  viewProduct(slug: string): void {
    this.router.navigate(['/product', slug]);
  }

  loadProducts(): void {
    this.productService.handleAsync().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products';
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleEdit(slug: string): void {
    this.isEditing[slug] = !this.isEditing[slug];
    this.newImagePreview = null;
  }

  saveProduct(product: ProductsGetAllResponse): void {
    const formData = new FormData();
    formData.append('slug', product.slug);
    formData.append('title', product.title);
    formData.append('price', product.price.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('isDigital', product.isDigital.toString());

    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('photos', this.selectedFiles[i], this.selectedFiles[i].name);
      }
    }

    this.updateService.handleAsync(formData).subscribe({
      next: (response: ProductUpdateResponse) => {
        alert('Product updated successfully!');
        this.loadProducts();
        this.toggleEdit(product.slug);
      },
      error: (err: HttpErrorResponse) => {
        alert('Failed to update product.');
        console.error(err);
      }
    });
  }

  onImageChange(event: Event, product: ProductsGetAllResponse): void {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      this.selectedFiles = input.files;

      const file = this.selectedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.newImagePreview = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  deleteProduct(slug: string): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.deleteService.handleAsync(slug).subscribe({
        next: () => {
          alert('Product deleted successfully!');
          this.loadProducts();
        },
        error: (err: HttpErrorResponse) => {
          alert('Failed to delete product.');
          console.error(err);
        }
      });
    }
  }
}
