import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ProductUpdateEndpointService
} from '../../../../../endpoints/products-endpoints/product-update-endpoint.service';
import { Product } from '../../../../../endpoints/products-endpoints/product-get-by-artist-id.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm: FormGroup;
  newImagePreview: string | null = null;
  selectedFiles: FileList | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Product,
    private dialogRef: MatDialogRef<ProductEditComponent>,
    private updateService: ProductUpdateEndpointService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder // Dodan FormBuilder
  ) {
    // Kreiranje Reactive Form-a sa inicijalnim vrednostima
    this.productForm = this.fb.group({
      title: [data.title, [Validators.required]],
      price: [data.price, [Validators.required, Validators.min(1)]],
      quantity: [data.quantity, [Validators.required, Validators.min(0)]],
      saleAmount: [data.saleAmount, [Validators.min(0)]],
      bio: [data.bio, [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onImageChange(event: Event): void {
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

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.snackBar.open('Please fill out all required fields correctly.', 'Close', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    const updatedProduct = this.productForm.value;

    formData.append('slug', this.data.slug); // Originalni slug iz podataka
    formData.append('title', updatedProduct.title);
    formData.append('price', updatedProduct.price.toString());
    formData.append('quantity', updatedProduct.quantity.toString());
    formData.append('isDigital', this.data.isDigital.toString());
    formData.append('SaleAmount', updatedProduct.saleAmount.toString());
    formData.append('bio', updatedProduct.bio);
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('photos', this.selectedFiles[i], this.selectedFiles[i].name);
      }
    }

    this.updateService.handleAsync(formData).subscribe({
      next: () => {
        this.snackBar.open('Product updated successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true); // Zatvori dialog s uspjehom
      },
      error: () => {
        this.snackBar.open('Failed to update product.', 'Close', { duration: 3000 });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false); // Zatvori dialog bez promjena
  }
}
