import { ChangeDetectorRef, Component } from '@angular/core';
import { ProductAddEndpointService, ProductAddRequest, ProductAddResponse } from '../../../../endpoints/products-endpoints/product-create-endpoint.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ArtistHandlerService } from '../../../../services/artist-handler.service';

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

  showClothesType = true;

  constructor(
    private productService: ProductAddEndpointService,
    private router: Router,
    private artistHandlerService: ArtistHandlerService,
    private cdr: ChangeDetectorRef
  ) {}

  onProductTypeChange(cbChange: Event): void {

    let cb = (cbChange.target as HTMLSelectElement).value
    console.log(this.productData.clothesType);
    if (cb === '0') {

      this.showClothesType = true;
      this.productData.clothesType = 0;
      console.log(this.showClothesType);

    } else {
      this.showClothesType = false;
      console.log(this.showClothesType);

      this.productData.clothesType = null;
    }
    this.cdr.detectChanges();
  }


  createProduct() {
    const selectedArtist = this.artistHandlerService.getSelectedArtist();
    if (selectedArtist && selectedArtist.id) {
      this.productData.artistId = selectedArtist.id;
    } else {
      alert('No valid artist selected');
      return;
    }

    if (!this.productData.title || this.productData.price <= 0 || this.productData.quantity < 0) {
      alert('Title, price (must be > 0), and quantity (must be >= 0) are required.');
      return;
    }

    this.productService.handleAsync(this.productData).subscribe({
      next: (response: ProductAddResponse) => {
        this.backToList();
      },
      error: (err: HttpErrorResponse) => {
        console.error("Error creating product:", err);
        alert("There was an error creating the product.");
      }
    });
  }

  backToList() {
    const selectedArtist = this.artistHandlerService.getSelectedArtist();
    if (selectedArtist && selectedArtist.name) {
      const artistName = selectedArtist.name.toLowerCase().replace(/\s+/g, '-');
      this.router.navigate([`/artist/${artistName}/products`]);
    } else {
      alert('No valid artist selected');
    }
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.productData.photos = Array.from(files);

      // Generiraj preview za slike
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
