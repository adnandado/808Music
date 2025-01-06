import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-order-confirmation-dialog',
  templateUrl: './order-confirmation-dialog.component.html',
  styleUrls: ['./order-confirmation-dialog.component.css']
})
export class OrderConfirmationDialogComponent {
  orderCode!: string;

  constructor(
    public dialogRef: MatDialogRef<OrderConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { orderCode: string },
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    console.log('Dialog data:', data);  // Provjeriti podatke koji se prosljeđuju
    if (data && data.orderCode) {
      this.orderCode = data.orderCode;
      console.log('Received orderCode:', this.orderCode);  // Ispisujemo orderCode
    } else {
      console.error('No orderCode received');
    }
  }

  onBackToHome(): void {
    this.router.navigate(['/home']);
    this.dialogRef.close();

  }

  onBackToStore(): void {
    this.router.navigate(['listener/store-home']);

    this.dialogRef.close();

  }

  OrderCode() {
    console.log(this.orderCode);
    return this.orderCode;
  }
}
