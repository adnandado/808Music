import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubscriptionDetails {
  id: number;
  title: string;
  description: string;
  price: number;
  subscriptionType: number;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionDetailsService {
  private readonly apiUrl = 'http://localhost:7000/api/subscription-details';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SubscriptionDetails[]> {
    return this.http.get<SubscriptionDetails[]>(this.apiUrl);
  }
}
