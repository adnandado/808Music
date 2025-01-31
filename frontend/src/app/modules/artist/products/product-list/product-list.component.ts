import { Component, OnInit } from '@angular/core';
import { ProductGetByArtistIdService, Product } from '../../../../endpoints/products-endpoints/product-get-by-artist-id.service';
import { Router } from '@angular/router';
import { ProductDeleteEndpointService } from '../../../../endpoints/products-endpoints/product-delete-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductUpdateEndpointService, ProductUpdateResponse } from '../../../../endpoints/products-endpoints/product-update-endpoint.service';
import { ArtistHandlerService } from '../../../../services/artist-handler.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import {MyConfig} from "../../../../my-config";
import {ProductEditComponent} from '../product-edit/product-edit.component';
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
    private artistHandlerService: ArtistHandlerService,
    private dialog: MatDialog,
    private snackBar : MatSnackBar
  ) {}

  ngOnInit(): void {
    this.products.forEach(product => {
      product.saleAmount = product.saleAmount * 100;
    });
    const selectedArtist = this.artistHandlerService.getSelectedArtist();
    if (selectedArtist) {
      this.artistId = selectedArtist.id;
      this.loadProducts();
    } else {
      this.errorMessage = 'No artist selected';
      this.loading = false;
    }
  }

  viewProduct(slug: string): void {
    this.router.navigate(['listener/product', slug]);
  }
  goToCreate() {
    this.router.navigate([`/artist/product-create`]);
  }
  loadProducts(): void {
    this.productService.getProductsByArtist(this.artistId).subscribe({
      next: (data: Product[]) => {
        this.products = data.map(product => {
          product.saleAmount = product.saleAmount * 100; // ovo množi za 100
          return {
            ...product,
            calculatedPrice: product.saleAmount > 0 ? product.price * (1 - (product.saleAmount / 100)) : product.price,
            visualSaleAmount: product.saleAmount > 0 ? product.saleAmount : 0,
          };
        });
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = 'Failed to load products';
        this.loading = false;
        console.error(err);
      }
    });
  }


  toggleEdit(product: Product): void {
    const dialogRef = this.dialog.open(ProductEditComponent, {
      width: '500px',
      data: product
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadProducts(); // Ponovno učitaj proizvode ako je bilo promjena
      }
    });
  }

  saveProduct(product: Product): void {
    const formData = new FormData();
    formData.append('slug', product.slug);
    formData.append('title', product.title);
    formData.append('price', product.price.toString());
    formData.append('quantity', product.quantity.toString());
    formData.append('isDigital', product.isDigital.toString());
    formData.append('SaleAmount', product.saleAmount.toString());
    formData.append('bio', product.bio);
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('photos', this.selectedFiles[i], this.selectedFiles[i].name);
      }
    }

    this.updateService.handleAsync(formData).subscribe({
      next: (response: ProductUpdateResponse) => {
        this.snackBar.open('Product updated successfully!.', 'Close', {
          duration: 3000,
        });
        this.loadProducts();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open('Product update failed!.', 'Close', {
          duration: 3000,
        });
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
      ? product.price * (1 - product.saleAmount/100)
      : product.price;
    return parseFloat(calculatedPrice.toFixed(2));
  }


  deleteProduct(slug: string): void {
    let product = this.products?.find(x => x.slug === slug);
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      data: {
        title: `Are you sure you want to delete "${product?.title}"?`,
        content: 'This will permanently delete this product.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteService.handleAsync(slug).subscribe({
          next: () => {
            this.snackBar.open(`${product?.title} deleted successfully!`, 'Close', {
              duration: 2000,
            });
            this.loadProducts();
          },
          error: (err: HttpErrorResponse) => {
            this.snackBar.open('Failed to delete product.', 'Close', {
              duration: 3000,
            });
            console.error(err);
          }
        });
      } else {
        console.log('Product deletion canceled');
      }
    });
  }



  productPrice(slug: string) : number {
    const product = this.products.find(p => p.slug === slug);
    if (product) {
      return product.saleAmount > 0 ? product.price * (1 - product.saleAmount) : product.price;
    }
    return 0;



  }

  updateSaleAmount(product: Product): void {
    product.saleAmount = product.saleAmount * 100;
  }

  protected readonly MyConfig = MyConfig;
}
