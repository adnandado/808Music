import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

interface Product {
  slug: string;
  title: string;
  price: number;
  quantity: number;
  isDigital: boolean;
  saleAmount: number;
  bio: string;
  productType: string;
  clothesType: string;
  photoPaths: string[];
  dateCreated: string;
  discountedPrice : number;
}

interface SearchResult {
  total: number;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductsSearchService {
  private apiUrl = `${MyConfig.api_address}/api/products/search`;

  constructor(private http: HttpClient) {}

  searchProducts(
    keyword: string,
    sortBy: string = 'title', // Default sorting by title
    page: number = 1,
    pageSize: number = 10
  ): Observable<SearchResult> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('sortBy', sortBy)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<SearchResult>(this.apiUrl, { params });
  }
}
