import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MyConfig} from '../../../../my-config';

export interface ConfirmDialogData {
  title: string;
  content: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  readonly data =  inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<ConfirmDialogData>) {
  }

  closeDialog(b: boolean) {
    this.dialogRef.close(b);
  }
}
