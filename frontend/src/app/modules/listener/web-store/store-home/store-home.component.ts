import { Component, OnInit } from '@angular/core';
import {
  ProductsGetTopWishlistedService
} from '../../../../endpoints/products-endpoints/products-get-random-endpoint.service';
import { ProductsGetNewestService } from '../../../../endpoints/products-endpoints/product-get-newest-endpoint.service';
import { ProductsGetBestSellingService } from '../../../../endpoints/products-endpoints/product-get-best-selling-endpoint.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product.model';
import { ProductsOnSaleService } from '../../../../endpoints/products-endpoints/products-on-sale-endpoint.service';
import { AddProductToWishlistEndpointService, AddProductToWishlistRequest, AddProductToWishlistResponse } from '../../../../endpoints/products-endpoints/add-to-wishlist-endpoint.service';
import { ProductIsOnWishlistService } from '../../../../endpoints/products-endpoints/is-product-on-wishlist-endpoint.service';
import { forkJoin } from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import {
  ProductAutocompleteService
} from '../../../../endpoints/products-endpoints/product-autocomplete-endpoint.service';
import {
  RemoveProductFromWishlistService
} from '../../../../endpoints/products-endpoints/remove-item-from-wishlist-endpoint.service';
import {MyConfig} from '../../../../my-config';
import {MatSnackBar} from '@angular/material/snack-bar';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-web-store',
  templateUrl: './store-home.component.html',
  styleUrls: ['./store-home.component.css'],
  animations: [
    trigger('pageAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.4s ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('0.5s ease-in', style({ opacity: 0 }))
      ])
    ]),
    trigger('profileImageAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0)', opacity: 0 }),
        animate('0.3s ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class WebStoreComponent implements OnInit {
  bestSellingProducts: Product[] = [];
  randomProducts: Product[] = [];
  newestProducts: Product[] = [];
  onSaleProducts: Product[] = [];
  loading: boolean = true;
  wishlist: Set<string> = new Set();
  keyword: string | null = '';
  isWishlistItem: boolean = false;
  searchControl = new FormControl();
  filteredProducts: Product[] = [];
  randomPlaceholder: string = '';

  placeholderOptions: string[] = [
    "Did Kanye drop something again?",
    "I heard GNX is really good, maybe a GNX Vinyl?",
    "A hoodie for your next date?",
    "Something to go with your espresso?",
    "Well, I'm shocked you didn't search for that shirt earlier",
    "I think 808 shop is the best! But don't tell 808 Music",
    "What’s trending today?",
    "I heard Travis dropped some new shirts",
    "Wow, you're here again! You really love exploring!",
    "ERROR 404 : Search not working! Just kidding, what can I find for you?",
    "New album, new merch, are you in?",
    "Want to show off your style with something fresh?",
    "Need something to match your new kicks?",
    "Searching for the latest tour merch?",
    "Your style, your merch. What are you feeling?",
    "Is it time to update your merch collection?",
    "What's up with that JPEG guy?",
    "Rep your favorite artist with the latest gear",
    "I dont know where you're from but be careful with color coordination",
    "Get the best pieces from the hottest artists",
    "Looking for that exclusive drop? Let's find it",
    "The search for the perfect merch ends here",
    "Your favorite band just dropped something new",
    "Something as smooth as Charlie Wilson's voice?",
    "Run it back with some Outkast shirts!",
    "Well well well, it's you again",
    "You think that The Dale Gribble Bluegrass Experience will make some merch?  ",
    "RIP MF DOOM",
    "RIP DMX",
    "RIP BIGGIE",
    "RIP PAC",
    "YEEZY SZN APPROACHING!",
    "Wake up, Mr. West!",
    "I AM MUSIC",
    "Wake me up when Carti drops",
    "We can help you to rep that new Yeezy first at school!",
    "Oh, it's you again!",
    "Ariana’s tour merch is out – stay sweet and stylish!",
    "You want to tell me you didnt check out Sabrinas new merch???",
    "DAMN!",
    "I feel like Gucci Mane in 2006 ♪♫♩♫",
    "01001110 01100101 01110010 01100100",
    "Let me explain why I wear this mask",
    "You look familiar...",
    "Love Sosa!",

  ];

  constructor(
    private productsGetTopWishlistedService: ProductsGetTopWishlistedService,
    private newestProductService: ProductsGetNewestService,
    private bestSellingProductService: ProductsGetBestSellingService,
    private productsOnSaleService: ProductsOnSaleService,
    private route: ActivatedRoute,
    private router: Router,
    private addProductToWishlist: AddProductToWishlistEndpointService,
    private productIsOnWishlistService: ProductIsOnWishlistService,
    private searchService : ProductAutocompleteService,
    private removeProductFromWishlistService : RemoveProductFromWishlistService,
    private snackBar : MatSnackBar
  ) {}

  ngOnInit(): void {
    this.setRandomPlaceholder();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((searchTerm: string) => {
        if (!searchTerm.trim()) {
          return [];
        }
        const request = { keyword: searchTerm };
        return this.searchService.handleAsync(request);
      })
    ).subscribe(
      (products) => {
        this.filteredProducts = products;
      },
      (error) => {
        console.error('Error during product search:', error);
        this.filteredProducts = [];
      }
    );
    forkJoin([
      this.newestProductService.handleAsync(),
      this.bestSellingProductService.handleAsync(),
      this.productsGetTopWishlistedService.handleAsync(),
      this.productsOnSaleService.handleAsync()
    ]).subscribe(
      ([newestData, bestSellingData, randomData, onSaleData]) => {
        this.newestProducts = this.mapProducts(newestData);
        this.bestSellingProducts = this.mapProducts(bestSellingData);
        this.randomProducts = this.mapProducts(randomData);
        this.onSaleProducts = this.mapProducts(onSaleData);

        this.checkWishlistForAllProducts();

        this.loading = false;
      },
      (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      }
    );

    this.route.queryParamMap.subscribe(params => {
      this.keyword = params.get('keyword');
    });
  }

  mapProducts(data: any[]): Product[] {
    return data.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      slug: item.slug,
      saleAmount: item.saleAmount,
      quantity: item.quantity,
      photoPaths: item.photoPaths,
      bio: item.bio,
      productType: item.productType,
      clothesType: item.clothesType
    }));
  }

  checkWishlistForAllProducts(): void {
    const allProducts = [
      ...this.newestProducts,
      ...this.bestSellingProducts,
      ...this.randomProducts,
      ...this.onSaleProducts
    ];
    console.log('Checking wishlist for products:', allProducts);

    allProducts.forEach(product => {

        this.checkIfOnWishlist(product);

    });
  }

  checkIfOnWishlist(product: Product): void {
    const userId = this.getUserIdFromToken();
    if (userId === null) {
      alert('You must be logged in to check if the product is on your wishlist.');
      return;
    }

    const request = {
      productSlug: product.slug,
      userId: userId,
    };

    this.productIsOnWishlistService.handleAsync(request).subscribe(
      (response) => {
        if (response.isOnWishlist) {
          this.wishlist.add(product.slug);
        }
      },
      (error) => {
        console.error('Error checking wishlist:', error);
      }
    );
  }

  viewProduct(slug: string): void {
    this.router.navigate(['listener/product', slug]);
  }

  toggleWishlist(event: MouseEvent, product: Product): void {
    event.stopPropagation();
    const userId = this.getUserIdFromToken();
    if (userId === null) {
      alert('You must be logged in to add items to the wishlist.');
      return;
    }
    if (this.isOnWishlist(product)) {
      this.removeFromWishlist(product.slug);
    } else {
      this.addToWish(product.slug);
    }
  }


  isOnWishlist(product: Product): boolean {
    return this.wishlist.has(product.slug);
  }

  private getUserIdFromToken(): number {
    let authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
      authToken = localStorage.getItem('authToken');
    }

    if (!authToken) {
      return 0;
    }

    try {
      const parsedToken = JSON.parse(authToken);
      return parsedToken.userId;
    } catch (error) {
      console.error('Error parsing authToken:', error);
      return 0;
    }
  }


  private addToWish(slug: string) {
    const userId = this.getUserIdFromToken();
    if (userId === null) {
      alert('You must be logged in to add items to the wishlist.');
      return;
    }
    const request: AddProductToWishlistRequest = {
      productSlug: slug,
      userId: userId
    };
    this.addProductToWishlist.handleAsync(request).subscribe(
      (response: AddProductToWishlistResponse) => {
        if (response.success) {
          this.ngOnInit();
          this.snackBar.open('Product added to Wishlist successfully', 'Close', {
            duration: 1500,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });

        } else {
          alert('Error: ' + response.message);
        }
      },
      (error) => {
        alert('An error occurred: ' + error.message);
      }
    );
  }

  updateCalculatedPrice(product: Product): string {
    const calculatedPrice = product.saleAmount > 0
      ? product.price * (1 - product.saleAmount)
      : product.price;
    return calculatedPrice.toFixed(2);
  }

  searchProducts(keyword: string): void {
    if (!keyword.trim()) {
      return;
    }
    this.router.navigate(['/listener/product-search'], {
      queryParams: { keyword },
    });
  }

  private removeFromWishlist(slug: string) {
    const userId = this.getUserIdFromToken();

    this.removeProductFromWishlistService.removeProductFromWishlist({
      productSlug: slug,
      userId: userId
    }).subscribe(
      (response) => {
        if (response.success) {

          this.wishlist.delete(slug);
          this.snackBar.open('Product removed from Wishlist successfully', 'Close', {
            duration: 1500,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });
        } else {
          console.log(response.message);
        }
      },
      (error) => {
        console.error('Error removing from wishlist:', error);
      }
    );
  }

  protected readonly MyConfig = MyConfig;

  private setRandomPlaceholder() {
    const randomIndex = Math.floor(Math.random() * this.placeholderOptions.length);
    this.randomPlaceholder = this.placeholderOptions[randomIndex];
  }
}
