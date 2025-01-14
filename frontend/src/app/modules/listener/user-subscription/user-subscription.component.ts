import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { SubscriptionDetails, SubscriptionDetailsService } from '../../../endpoints/subscription-endpoints/get-subscription-details-endpoint.service';
import { SubscriptionAddEndpointService } from '../../../endpoints/subscription-endpoints/add-subscription-endpoint.service';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { StripeService } from '../../../endpoints/stripe-endpoints/stripe-endpoint.service'; // Import StripeService
import { UserService } from '../../../endpoints/user-endpoints/get-user-info-endpoints.service';
import {
  IsSubscribedRequest,
  IsSubscribedService
} from '../../../endpoints/auth-endpoints/is-subscribed-endpoint.service';
import {
  UserSubscriptionDetailsResponse,
  UserSubscriptionService
} from '../../../endpoints/subscription-endpoints/user-subscription-type-endpoint.service';
import moment from 'moment';
import {MyConfig} from '../../../my-config';
import {MatSnackBar} from '@angular/material/snack-bar'; // Import UserService

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css'],
})
export class UserSubscriptionComponent implements OnInit {
  subscriptions: SubscriptionDetails[] = [];
  subscriptionDetails: UserSubscriptionDetailsResponse = {
    subscription: {
      subscriptionType: 0,
      title: '',
      description: '',
      price: 0,
      startDate: '',
      endDate: '',
      renewalOn: false,
      message: ''
    }
  };
  selectedSubscription: SubscriptionDetails | null = null;
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  paymentSuccess: boolean = false;
  errorMessage: string = '';
  planColors: { [key in '1' | '2' | '3']: string } = {
    '1': '#b3f6b3',  // One month plan boja (Indigo)
    '2': '#f6e795',  // 6 month plan boja (Gold)
    '3': '#cf9ef8'   // 1 year plan boja (Lime Green)
  };

  constructor(
    private subscriptionService: SubscriptionDetailsService,
    private subscriptionAddService: SubscriptionAddEndpointService,
    private userService: UserService,
    private stripeService: StripeService,
  private cdr: ChangeDetectorRef,
    private isSubscribedService : IsSubscribedService,
    private userSubscriptionService : UserSubscriptionService,
    private snackBar : MatSnackBar
  ) {}
  userSubscribed = false;
  async ngOnInit(): Promise<void> {
    const userId = this.getUserIdFromToken();
    this.userSubscriptionService.getUserSubscriptionDetails(userId).subscribe({
      next: (response: UserSubscriptionDetailsResponse) => {
        this.subscriptionDetails = response;
        this.userSubscribed = response.subscription.subscriptionType != null;
        console.log('User subscription details:', response);
      },
      error: (err) => {
        console.error('Error fetching subscription details:', err);
      }
    });

    this.isUserSubscribed();
    this.subscriptionService.getAll().subscribe((data) => {
      this.subscriptions = data;
    });

    this.stripe = await loadStripe('pk_test_51QEZojCQgR3U8MdBa1uGUBRSshgia3TauM5hIFtla1wprW3iNEJX6yzk1p2liFGNmjavOYxRDxDEvauXP7in5gOZ00Jr5eCt3w');
    if (this.stripe) {
      this.elements = this.stripe.elements();

    } else {
      console.error('Stripe nije učitan');
    }
  }
  getPlanBackgroundColor(planType: number): string {
    const planTypeString = planType.toString() as '1' | '2' | '3';
    return this.planColors[planTypeString] || '#333333';
  }
  loadStripeCard(): void {
    if (this.stripe && this.elements) {
      if (this.card) {
        this.card.mount('#card-element');
      } else {
        this.card = this.elements.create('card');
        this.card.mount('#card-element');
      }

      this.cdr.detectChanges();
    } else {
      console.error('Stripe ili Elements nisu inicijalizirani');
    }
  }


  createPaymentIntent(userId: number): void {
    if (this.stripe && this.card && this.selectedSubscription) {
      let amountInCents: number;

      if (this.selectedSubscription?.price === 8.99) {
        amountInCents = Math.round(this.selectedSubscription?.price * 100) * 6;
      } else if (this.selectedSubscription?.price === 6.50) {
        amountInCents = Math.round(this.selectedSubscription?.price * 100) * 12;
      } else {
        amountInCents = Math.round(this.selectedSubscription?.price * 100);
      }
      this.userService.getUserInfo(userId).subscribe(
        (userInfo) => {
          const email = userInfo.email;
          this.stripeService.createPaymentIntent(amountInCents, email).subscribe(
            (response) => {
              const clientSecret = response.clientSecret;
              this.confirmPayment(clientSecret, userId);
            },
            (error) => {
              this.errorMessage = 'Error creating payment intent: ' + error.message;
            }
          );
        },
        (error) => {
          this.errorMessage = 'Error fetching user info: ' + error.message;
        }
      );
    }
  }

  confirmPayment(clientSecret: string, userId: number): void {
    if (this.stripe && this.card) {
      this.stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: this.card,
        },
      }).then((result) => {
        if (result.error) {
          this.errorMessage = result.error.message || 'Payment failed';
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
          this.paymentSuccess = true;
          this.snackBar.open('Payment successful!', 'Close', {
            duration: 1500,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });
          this.addSubscription(userId);
        }
      });
    }
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

  subscribe(subscription: SubscriptionDetails): void {
    this.selectedSubscription = subscription;
    const userId = this.getUserIdFromToken();
    if (!userId) {
      this.errorMessage = 'User ID not found.';
      return;
    }


    this.createPaymentIntent(userId);
  }
  selectPlan(subscription: SubscriptionDetails): void {
    this.selectedSubscription = subscription;
    this.paymentSuccess = false;
    this.errorMessage = '';

    setTimeout(() => {
      this.loadStripeCard();
    }, 200);
  }



  handleSubmit(): void {
    if (!this.selectedSubscription) {
      this.errorMessage = 'Please select a subscription plan first.';
      return;
    }

      this.loadStripeCard();

    this.subscribe(this.selectedSubscription);
  }

  addSubscription(userId: number): void {
    this.subscriptionAddService.handleAsync({
      userId,
      subscriptionType: this.selectedSubscription?.id || 1,
      renewalOn: true,
    }).subscribe(
      (response) => {
        if (response.success) {
          this.snackBar.open('Subscription added successful!', 'Close', {
            duration: 1500,
            verticalPosition: 'bottom',
            horizontalPosition: 'center'
          });setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        this.errorMessage = 'Error adding subscription: ' + error.message;
      }
    );
  }

  private isUserSubscribed() {
    const request: IsSubscribedRequest = {
      userId : this.getUserIdFromToken()
    };
    this.isSubscribedService.handleAsync(request).subscribe({
      next: (response) => {
        if (response.isSubscribed)
        {
          this.userSubscribed = true;

        }
        else
        {
          this.userSubscribed = false;

        }
      },
      error: (err) => {
        console.error('Error:', err);

      },
    });
  }

  getSubscriptionTitle(subscriptionType: number | null) {
    return "";
  }

  protected readonly moment = moment;
  protected readonly MyConfig = MyConfig;

  getPrice() {
    let amountInCents
    if (this.selectedSubscription?.price === 8.99) {
      amountInCents = this.selectedSubscription?.price * 6;
    } else if (this.selectedSubscription?.price === 6.50) {
      amountInCents = this.selectedSubscription?.price  * 12;
    } else {
      amountInCents = this.selectedSubscription?.price!;
    }
    return amountInCents
  }
}
