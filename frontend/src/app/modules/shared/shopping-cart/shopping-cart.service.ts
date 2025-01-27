import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartUpdateService {
  private cartUpdatedSource = new Subject<void>();
  cartUpdated$ = this.cartUpdatedSource.asObservable();
  notifyCartUpdated() {
    this.cartUpdatedSource.next();
  }
}
