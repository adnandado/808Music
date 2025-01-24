import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-social-share-bottom-sheet',
  templateUrl: './social-share-bottom-sheet.component.html',
  styleUrls: ['./social-share-bottom-sheet.component.css'],
})
export class SocialShareBottomSheetComponent {
  constructor(
    private bottomSheetRef: MatBottomSheetRef<SocialShareBottomSheetComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: { url: string }
  ) {}

  shareOnTwitter(): void {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(this.data.url)}`;
    window.open(twitterUrl, '_blank');
    this.bottomSheetRef.dismiss();
  }

  shareOnMessenger(): void {
    const messengerUrl = `https://www.messenger.com/t/?link=${encodeURIComponent(this.data.url)}`;
    window.open(messengerUrl, '_blank');
    this.bottomSheetRef.dismiss();
  }

  shareOnWhatsApp(): void {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(this.data.url)}`;
    window.open(whatsappUrl, '_blank');
    this.bottomSheetRef.dismiss();
  }

  shareOnLinkedIn(): void {
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(this.data.url)}`;
    window.open(linkedInUrl, '_blank');
    this.bottomSheetRef.dismiss();
  }

  shareOnPinterest(): void {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(this.data.url)}`;
    window.open(pinterestUrl, '_blank');
    this.bottomSheetRef.dismiss();
  }

  shareOnReddit(): void {
    const redditUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(this.data.url)}`;
    window.open(redditUrl, '_blank');
    this.bottomSheetRef.dismiss();
  }

  copyToClipboard(): void {
    navigator.clipboard.writeText(this.data.url).then(() => {
    this.snackBar.open('Copied to clipboard','', {
      duration: 1500,
      verticalPosition: 'bottom',
      horizontalPosition: 'center'
    })
    }).catch(() => {
      alert('Failed to copy link!');
    });
  }

  shareOnViber(): void {
    const viberUrl = `viber://forward?text=${encodeURIComponent(this.data.url)}`;
    window.open(viberUrl, '_blank');
    this.bottomSheetRef.dismiss();
  }
}
