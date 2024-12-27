import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyConfig } from '../../my-config';

export interface ProductUpdateResponse {
  id: number;
  title: string;
  quantity: number;
  isDigital: boolean;
  price: number;
  SaleAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductUpdateEndpointService {
  readonly url = `${MyConfig.api_address}/api/ProductUpdateEndpoint`; // Ispravan URL

  constructor(private httpClient: HttpClient) {}

  handleAsync(formData: FormData): Observable<ProductUpdateResponse> {
    if (!formData.has('slug') || !formData.has('title') || !formData.has('price')) {
      return throwError(() => new Error('Required fields are missing.'));
    }

    return this.httpClient.put<ProductUpdateResponse>(this.url, formData);
  }
}
