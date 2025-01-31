import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClothesType, ProductType } from './product-create-endpoint.service';
import { MyConfig } from '../../my-config';

export interface Product {
  slug: string;
  title: string;
  price: number;
  quantity: number;
  isDigital: boolean;
  photoPaths: string[];
  name: string;
  saleAmount: number;
  bio: string;
  productType: ProductType;
  clothesType: ClothesType;
}

@Injectable({
  providedIn: 'root'
})
export class ProductGetByArtistIdService {
  private apiUrl = `${MyConfig.api_address}/api/ProductGetByArtistEndpoint`;

  constructor(private http: HttpClient) {}

  getProductsByArtist(
    artistId: number,
    minPrice?: number,
    maxPrice?: number,
    productType?: ProductType,
    clothesType?: ClothesType,
    searchQuery?: string,
    sortByPrice?: 'asc' | 'desc',  // Sortiranje po cijeni
    sortBySaleAmount?: 'asc' | 'desc',  // Sortiranje po popustu
    sortByOldest?: 'true' | 'false',  // Sortiranje po najstarijim
    sortByNewest?: 'true' | 'false'  // Sortiranje po najnovijim
  ): Observable<Product[]> {
    let params = new HttpParams().set('ArtistId', artistId.toString());

    // Dodavanje filtera za cijenu
    if (minPrice != null) params = params.set('MinPrice', minPrice.toString());
    if (maxPrice != null) params = params.set('MaxPrice', maxPrice.toString());

    // Dodavanje filtera za tip proizvoda
    if (productType != null) params = params.set('ProductType', productType.toString());

    // Dodavanje filtera za tip odjeće
    if (clothesType != null) params = params.set('ClothesType', clothesType.toString());

    // Dodavanje filtera za pretragu
    if (searchQuery) params = params.set('SearchQuery', searchQuery);

    // Dodavanje filtera za sortiranje
    if (sortByPrice) params = params.set('SortByPrice', sortByPrice);
    if (sortBySaleAmount) params = params.set('SortBySaleAmount', sortBySaleAmount);
    if (sortByOldest) params = params.set('SortByOldest', sortByOldest);
    if (sortByNewest) params = params.set('SortByNewest', sortByNewest);

    return this.http.get<Product[]>(this.apiUrl, { params });
  }
}
