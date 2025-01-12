import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-please-subscribe',
  templateUrl: './please-subscribe.component.html',
  styleUrls: ['./please-subscribe.component.css'],
})
export class PleaseSubscribeComponent {
  private dialogRef = inject(MatDialogRef<PleaseSubscribeComponent>);

  dismiss() {
    this.dialogRef.close();
  }

  goToSubscriptions() {
    this.dialogRef.close('navigate');
  }
}
