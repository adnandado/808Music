import {Component, Inject, inject, Injectable} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MyConfig} from '../../../../my-config';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'app-share-bottom-sheet',
  templateUrl: './share-bottom-sheet.component.html',
  styleUrl: './share-bottom-sheet.component.css'
})
export class ShareBottomSheetComponent {
  bottomRef = inject<MatBottomSheetRef<ShareBottomSheetComponent>>(MatBottomSheetRef)
  logoPath = MyConfig.api_address + "/media/logo_qr.png";
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) protected data: { url:string },
              private clipboard : Clipboard) {
  }

  dismissSheet() {
    this.bottomRef.dismiss();
  }

  copyToClipboard() {
    this.clipboard.copy(this.data.url);
  }
}
