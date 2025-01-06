import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  constructor(private route : Router,){

  }
    goToWishlist() {
this.route.navigate(['listener/product-wishlist']);
    }
}
