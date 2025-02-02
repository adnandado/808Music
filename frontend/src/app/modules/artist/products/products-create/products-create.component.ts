import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductAddEndpointService, ProductAddRequest, ProductAddResponse } from '../../../../endpoints/products-endpoints/product-create-endpoint.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ArtistHandlerService } from '../../../../services/artist-handler.service';
import { Location } from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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
    photos: [],
    artistId: 0,
    productType: 0,
    clothesType: 0,
    bio: '',
  };

  previewPhotos: string[] = [];
  productTypes = [
    { id: 0, name: 'Clothes' },
    { id: 1, name: 'Vinyls' },
    { id: 2, name: 'CDS' },
    { id: 3, name: 'Posters' },
    { id: 4, name: 'Accessories' },
    { id: 5, name: 'Miscellaneous' },
  ];

  clothesTypes = [
    { id: 0, name: 'Shirt' },
    { id: 1, name: 'Jacket' },
    { id: 2, name: 'Top' },
    { id: 3, name: 'Hat' },
    { id: 4, name: 'Hoodie' },
    { id: 5, name: 'Socks' },
  ];
  createForm : FormGroup;
  showClothesType = true;

  constructor(
    private productService: ProductAddEndpointService,
    private router: Router,
    private location: Location,
    private artistHandlerService: ArtistHandlerService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,

  ) {  this.productData.clothesType = 0;
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      isDigital: [false, Validators.required],
      productType: [0, Validators.required],
      clothesType: [0],
      bio: ['', [Validators.required, Validators.maxLength(1000)]],
      photos: [[], Validators.required]
    });
  }

  onProductTypeChange(cbChange: Event): void {
    let cb = (cbChange.target as HTMLSelectElement).value;

    if (cb === '0') {
      this.showClothesType = true;
      this.createForm.get('clothesType')?.setValue(0);
    } else {
      this.showClothesType = false;
      this.createForm.get('clothesType')?.disable();
      this.createForm.get('clothesType')?.setValue(null);
    }

    this.cdr.detectChanges();
  }
  createProduct() {
    this.createForm.markAllAsTouched();

    const formValues = { ...this.createForm.value };

    this.productData = {
      ...formValues,
      photos: this.productData.photos,
    };

    const selectedArtist = this.artistHandlerService.getSelectedArtist();
    if (selectedArtist && selectedArtist.id) {
      this.productData.artistId = selectedArtist.id;
      console.log(selectedArtist.id);
    } else {
      alert('No valid artist selected');
      return;
    }

    if (!this.productData.title || this.productData.price <= 0 || this.productData.quantity < 0) {
      return;
    }

    console.log('Final Product Data:', this.productData);

    this.productService.handleAsync(this.productData).subscribe({
      next: (response: ProductAddResponse) => {
        this.backToList();
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error creating product:", err);
      }
    });
  }



  backToList() {
    this.location.back();
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    console.log("Files selected:", files);

    if (files.length > 0) {
      this.productData.photos = Array.from(files);
      console.log("Selected Photos:", this.productData.photos);

      this.previewPhotos = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewPhotos.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }





}
