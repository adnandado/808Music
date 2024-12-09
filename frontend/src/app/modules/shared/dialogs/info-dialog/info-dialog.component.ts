import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogData} from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-info-dialog',
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.css'
})
export class InfoDialogComponent {
  readonly data =  inject<ConfirmDialogData>(MAT_DIALOG_DATA);

  constructor(private dialogRef: MatDialogRef<ConfirmDialogData>) {
  }
}
