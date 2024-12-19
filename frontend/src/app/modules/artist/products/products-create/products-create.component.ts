import { Component } from '@angular/core';
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
    artistId: 0  // Dodano polje za ID odabranog umjetnika
  };

  constructor(
    private productService: ProductAddEndpointService,
    private router: Router,
    private artistHandlerService: ArtistHandlerService
  ) {}

  createProduct() {
    // Dohvat ID-a odabranog umjetnika
    const selectedArtist = this.artistHandlerService.getSelectedArtist();
    if (selectedArtist && selectedArtist.id) {
      // Postavljanje artistId
      this.productData.artistId = selectedArtist.id;
    } else {
      alert('No valid artist selected');
      return;
    }

    // Provjera da li su svi podaci ispravno popunjeni
    if (!this.productData.title || !this.productData.price) {
      alert('Title and price are required.');
      return;
    }

    this.productService.handleAsync(this.productData).subscribe({
      next: (response: ProductAddResponse) => {
        this.backToList();
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
    const selectedArtist = this.artistHandlerService.getSelectedArtist();
    if (selectedArtist && selectedArtist.name) {
      const artistName = selectedArtist.name.toLowerCase().replace(/\s+/g, '-'); // Pretvaranje imena u URL format
      this.router.navigate([`/artist/${artistName}/product-list`]); // Preusmeravanje na dinamički URL
    } else {
      alert('No valid artist selected');
    }
  }

  onFilesSelected(event: any): void {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.productData.photos = Array.from(files);
    }
  }
}
