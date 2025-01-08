import { Injectable } from '@angular/core';
import { MyBaseEndpointAsync } from '../../helper/my-base-endpoint-async.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MyAuthService } from '../../services/auth-services/my-auth.service';
import { MyConfig } from '../../my-config';

export interface ProductAddRequest {
  title: string;
  price: number;
  quantity: number;
  isDigital: boolean;
  photos?: File[];
  artistId: number;
  bio?: string;
  productType: ProductType;
  clothesType?: ClothesType | null;
}

export interface ProductAddResponse {
  id: number;
  title: string;
  price: number;
  quantity: number;
  isDigital: boolean;
  slug: string;
  artistId: number;
  bio?: string;
  productType: ProductType;
  clothesType?: ClothesType;
}

export enum ProductType {
  Clothes = 0,
  Vinyls = 1,
  CDS = 2,
  Posters = 3,
  Accessories = 4,
  Miscellaneous = 5,
}

export enum ClothesType {
  Shirt = 0,
  Jacket = 1,
  Top = 2,
  Hat = 3,
  Hoodie = 4,
  Socks = 5,
}

@Injectable({
  providedIn: 'root',
})
export class ProductAddEndpointService
  implements MyBaseEndpointAsync<ProductAddRequest, ProductAddResponse>
{
  readonly url = `${MyConfig.api_address}/api/ProductAddEndpoint`;

  constructor(private httpClient: HttpClient, private myAuthService: MyAuthService) {}

  handleAsync(request: ProductAddRequest): Observable<ProductAddResponse> {
    if (!request.title || !request.price) {
      return throwError(() => new Error('All required fields must be provided.'));
    }

    const formData = new FormData();
    formData.append('title', request.title);
    formData.append('price', request.price.toString());
    formData.append('quantity', request.quantity.toString());
    formData.append('isDigital', request.isDigital.toString());
    formData.append('artistId', request.artistId.toString());
    if (request.bio) {
      formData.append('bio', request.bio);
    }
    formData.append('productType', request.productType.toString());
    if (request.clothesType != null) {
      formData.append('clothesType', request.clothesType.toString());
    } else {
      formData.append('clothesType', '');
    }


    if (request.photos && request.photos.length > 0) {
      for (let i = 0; i < request.photos.length; i++) {
        formData.append('photos', request.photos[i]);
      }
    }

    return this.httpClient.post<ProductAddResponse>(this.url, formData);
  }
}
