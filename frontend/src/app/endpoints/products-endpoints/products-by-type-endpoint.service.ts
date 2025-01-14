import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class ProductByTypeService {
  private baseUrl: string = `${MyConfig.api_address}/api/products/bytype`;

  constructor(private http: HttpClient) {}

  getProductsByType(
    productType: number,
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'title'
  ): Observable<any> {
    const params = new HttpParams()
      .set('productType', productType.toString())
      .set('page', page.toString())
      .set('pageSize', pageSize.toString())
      .set('sortBy', sortBy);

    return this.http.get<any>(this.baseUrl, { params });
  }
}
