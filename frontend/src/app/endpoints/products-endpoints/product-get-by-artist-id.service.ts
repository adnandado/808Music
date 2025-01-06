import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {ClothesType, ProductType} from './product-create-endpoint.service';

export interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number;
  isDigital: boolean;
  photoPaths: string[];
  slug: string;
  saleAmount: number;
  bio: string;
  productType: ProductType;
  clothesType: ClothesType;
}

@Injectable({
  providedIn: 'root'
})
export class ProductGetByArtistIdService {
  private apiUrl = 'http://localhost:7000/api/ProductGetByArtistEndpoint/api/ProductGetByArtist'; // Tvoj backend URL

  constructor(private http: HttpClient) {}

  getProductsByArtist(artistId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${artistId}`);
  }
}
