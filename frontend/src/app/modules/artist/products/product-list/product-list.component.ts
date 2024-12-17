import { Component, OnInit } from '@angular/core';
import { ProductsGetAllService, ProductsGetAllResponse } from '../../../../endpoints/products-endpoints/product-get-all-endpoint.service';
import { Router } from '@angular/router';
import { ProductDeleteEndpointService } from '../../../../endpoints/products-endpoints/product-delete-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductUpdateEndpointService, ProductUpdateRequest, ProductUpdateResponse } from '../../../../endpoints/products-endpoints/product-update-endpoint.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: ProductsGetAllResponse[] = [];
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private productService: ProductsGetAllService, private updateService : ProductUpdateEndpointService, private deleteService: ProductDeleteEndpointService, private router: Router) {

  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.handleAsync().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load products';
        console.error(err);
        this.loading = false;
      }
    });
  }

  editProduct(product: ProductsGetAllResponse): void {
    const updatedProduct: ProductUpdateRequest = {
      id: product.id,
      title: prompt('Enter new title:', product.title) || product.title,
      price: parseFloat(prompt('Enter new price:', product.price.toString()) || product.price.toString()),
      quantity: parseInt(prompt('Enter new quantity:', product.quantity.toString()) || product.quantity.toString(), 10),
      isDigital: confirm('Is this product digital? Click OK for Yes or Cancel for No.') || product.isDigital
    };

    this.updateService.handleAsync(updatedProduct).subscribe({
      next: (response: ProductUpdateResponse) => {
        alert('Product updated successfully!');
        this.loadProducts();
      },
      error: (err: HttpErrorResponse) => {
        alert('Failed to update product.');
        console.error('Error updating product:', err);
      }
    });
  }
  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.deleteService.handleAsync(id).subscribe({
        next: () => {

          this.loadProducts();
          alert('Product deleted successfully!');
          },
        error: (err : HttpErrorResponse) => {
          alert('Failed to delete product.');
          console.error('Error deleting product:', err);
        }
      });
    }
  }


  createNewProduct(): void {
    this.router.navigate(['/product-create']);
  }
}
