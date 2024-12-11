import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogData} from '../confirm-dialog/confirm-dialog.component'
import {FormControl} from '@angular/forms';

export interface TextDialogData {
  title: string;
  content: string;
  inputLabel: string;
  placeholder: string;
  type: string;
}

@Component({
  selector: 'app-text-input-dialog',
  templateUrl: './text-input-dialog.component.html',
  styleUrl: './text-input-dialog.component.css'
})
export class TextInputDialogComponent {
  readonly data =  inject<TextDialogData>(MAT_DIALOG_DATA);
  inputValue = new FormControl('');

  constructor(private dialogRef: MatDialogRef<TextDialogData>) {
  }

  closeDialog(b: boolean) {
    if(b)
    {
      this.dialogRef.close(this.inputValue.value);
    }
    else
    {
      this.dialogRef.close(null);
    }
  }
}
