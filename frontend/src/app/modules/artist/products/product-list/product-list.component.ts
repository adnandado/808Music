import { Component, OnInit } from '@angular/core';
import { ProductGetByArtistIdService, Product } from '../../../../endpoints/products-endpoints/product-get-by-artist-id.service';
import { Router } from '@angular/router';
import { ProductDeleteEndpointService } from '../../../../endpoints/products-endpoints/product-delete-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductUpdateEndpointService, ProductUpdateResponse } from '../../../../endpoints/products-endpoints/product-update-endpoint.service';
import { ArtistHandlerService } from '../../../../services/artist-handler.service';
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  selectedFiles: FileList | null = null;
  isEditing: { [key: string]: boolean } = {};
  newImagePreview: string | null = null;
  artistId: number = 1;

  constructor(
    private productService: ProductGetByArtistIdService,
    private updateService: ProductUpdateEndpointService,
    private deleteService: ProductDeleteEndpointService,
    private router: Router,
  private artistHandlerService: ArtistHandlerService
  ) {}

  ngOnInit(): void {
    const selectedArtist = this.artistHandlerService.getSelectedArtist();
    if (selectedArtist) {
      this.artistId = selectedArtist.id;
      this.loadProducts();
    } else {
      this.errorMessage = 'No artist selected';
      this.loading = false;
    }
    console.log('PlaylistListMaterialComponent initialized');
  }

  viewProduct(slug: string): void {
    this.router.navigate(['/product', slug]);
  }

  loadProducts(): void {
    this.productService.getProductsByArtist(this.artistId).subscribe({
      next: (data: Product[]) => {
        this.products = data.map(product => ({
          ...product,
          calculatedPrice: product.saleAmount > 0 ? product.price * (1 - product.saleAmount) : product.price
        }));
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
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

  saveProduct(product: Product): void {
    const formData = new FormData();
    formData.append('slug', product.slug);
    formData.append('title', product.title);
    formData.append('price', product.price.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('isDigital', product.isDigital.toString());
    formData.append('SaleAmount', product.saleAmount.toString());

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

  onImageChange(event: Event, product: Product): void {
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
  updateCalculatedPrice(product: Product): number {
    const calculatedPrice = product.saleAmount > 0
      ? product.price * (1 - product.saleAmount)
      : product.price;
    return parseFloat(calculatedPrice.toFixed(2));
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

  productPrice(slug: string) : number {
    const product = this.products.find(p => p.slug === slug);
    if (product) {
      return product.saleAmount > 0 ? product.price * (1 - product.saleAmount) : product.price;
    }
    return 0;



  }

  updateSaleAmount(product: Product): number {
    var calculatedSale = product.saleAmount * 100
    return calculatedSale;
  }

}
