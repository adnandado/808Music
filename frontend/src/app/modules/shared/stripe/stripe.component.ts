import { Component, OnInit } from '@angular/core';
import { loadStripe, Stripe, StripeCardElement, StripeElements } from '@stripe/stripe-js';
import { StripeService } from '../../../endpoints/stripe-endpoints/stripe-endpoint.service';

@Component({
  selector: 'app-stripe-component',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css'],
})
export class StripeComponent implements OnInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  card: StripeCardElement | null = null;
  amount: number = 0;
  errorMessage: string = '';
  paymentSuccess: boolean = false;

  constructor(private stripeService: StripeService) {}

  async ngOnInit() {
    this.stripe = await loadStripe('pk_test_51QEZojCQgR3U8MdBa1uGUBRSshgia3TauM5hIFtla1wprW3iNEJX6yzk1p2liFGNmjavOYxRDxDEvauXP7in5gOZ00Jr5eCt3w');
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.card = this.elements.create('card');
      this.card.mount('#card-element');
    }
  }

  async handleSubmit(amount: number): Promise<void> {
    if (!this.stripe || !this.elements || !this.card) {
      return;
    }

    // Validacija unosa kartičnog broja, datuma i CVC-a
    const cardNumberPattern = /^\d{16}$/;
    const expiryDatePattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    const cvcPattern = /^\d{3,4}$/;

    // Provjeravamo da li je amount validan i pretvaramo u centima (100 centi = 1 EUR)
    if (amount <= 0) {
      this.errorMessage = 'Amount must be greater than 0.';
      return;
    }
    const amountInCents = Math.round(amount * 100);

    // Pozovi backend za kreiranje PaymentIntent-a
    this.stripeService.createPaymentIntent(amountInCents).subscribe(
      async (response) => {
        const clientSecret = response.clientSecret;

        // @ts-ignore
        const { error, paymentIntent } = await this.stripe?.confirmCardPayment(clientSecret, {
          payment_method: {
            card: this.card!,
          },
        });

        if (error) {
          this.errorMessage = error.message ?? 'An error occurred during the payment process.';
          this.paymentSuccess = false;
        } else if (paymentIntent?.status === 'succeeded') {
          this.errorMessage = '';
          this.paymentSuccess = true;
          console.log('Payment successful!');
        }
      },
      (error) => {
        this.errorMessage = 'Error creating payment intent: ' + error.message;
        this.paymentSuccess = false;
      }
    );
  }
}
