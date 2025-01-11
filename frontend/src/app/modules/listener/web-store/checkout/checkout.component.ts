import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetShoppingCartService } from '../../../../endpoints/products-endpoints/get-shopping-cart-endpoint.service';
import { StripeService } from '../../../../endpoints/stripe-endpoints/stripe-endpoint.service';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { MatDialog } from '@angular/material/dialog';
import {
  OrderAddEndpointService,
  OrderAddRequest,
  OrderAddResponse
} from '../../../../endpoints/products-endpoints/add-order-endpoint.service';
import { OrderConfirmationDialogComponent } from './order-confirmation-dialog/order-confirmation-dialog.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice: number = 0;
  userId: number | null = null;
  checkoutForm: FormGroup;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  stripeClientSecret: string | null = null;
  currentStep: number = 0;

  errorMessage: string = '';
  paymentSuccess: boolean = false;
  orderCode: string = '';

  constructor(
    private getShoppingCartService: GetShoppingCartService,
    private stripeService: StripeService,
    private fb: FormBuilder,
    private orderAddService: OrderAddEndpointService,
    private router: Router,
    private ngzone: NgZone,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.userId = this.getUserIdFromToken();
    if (this.userId) {
      this.fetchCartItems();
    } else {
      this.router.navigate(['/login']);
    }

    this.stripe = await loadStripe('pk_test_51QEZojCQgR3U8MdBa1uGUBRSshgia3TauM5hIFtla1wprW3iNEJX6yzk1p2liFGNmjavOYxRDxDEvauXP7in5gOZ00Jr5eCt3w');
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    }
  }

  fetchCartItems(): void {
    this.getShoppingCartService.getCart(this.userId!).subscribe({
      next: (response) => {
        if (response.success) {
          this.cartItems = response.cartItems;
          this.totalPrice = this.calculateTotalPrice();
        }
      },
      error: (err) => {
        console.error('Error fetching cart items', err);
      }
    });
  }

  calculateTotalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.discountedPrice * item.quantity, 0);
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

  async handleSubmit(): Promise<void> {
    if (!this.stripe || !this.elements || !this.card) {
      this.errorMessage = 'Stripe is not initialized properly.';
      return;
    }

    if (this.checkoutForm.invalid) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }

    const email = "adnan@gmail.com";
    const amountInCents = Math.round(this.totalPrice * 100);

    this.stripeService.createPaymentIntent(amountInCents, email).subscribe(
      async (response) => {
        const clientSecret = response.clientSecret;
        const { error, paymentIntent } = await this.stripe!.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card!,
            billing_details: {
              name: this.checkoutForm.value.name,
              email: email
            }
          }
        });

        if (error) {
          this.errorMessage = error.message ?? 'An error occurred during the payment process.';
          this.paymentSuccess = false;
        } else if (paymentIntent?.status === 'succeeded') {
          this.errorMessage = '';
          this.paymentSuccess = true;
          console.log('Payment successful!');

          const userId = this.getUserIdFromToken();
          const request: OrderAddRequest = { userId: userId !== null ? userId : 0 };

          this.orderAddService.handleAsync(request).subscribe(
            (response) => {
              console.log('Order added:', response);
              this.orderCode = response.orderCode;
              this.ngzone.run(() => {
                this.dialog.open(OrderConfirmationDialogComponent, {
                  data: { orderCode: this.orderCode }
                });
              });
              this.changeDetectorRef.detectChanges();
            },
            (error) => {
              console.error('Error adding order:', error);
            }
          );
        }
      },
      (error) => {
        this.errorMessage = 'Error creating payment intent: ' + error.message;
        this.paymentSuccess = false;
      }
    );
  }
}
