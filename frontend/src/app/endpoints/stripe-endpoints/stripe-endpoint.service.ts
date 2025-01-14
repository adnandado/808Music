import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {MyConfig} from '../../my-config';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  readonly apiUrl = `${MyConfig.api_address}/api/Stripe/create-payment-intent`;

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, email: string): Observable<any> {
    return this.http.post(this.apiUrl, { amount, email});
  }
}
