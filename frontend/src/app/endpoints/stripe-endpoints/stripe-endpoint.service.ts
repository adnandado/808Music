import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private apiUrl = 'http://localhost:7000/api/Stripe/create-payment-intent';

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number, email: string): Observable<any> {
    return this.http.post(this.apiUrl, { amount, email});
  }
}
