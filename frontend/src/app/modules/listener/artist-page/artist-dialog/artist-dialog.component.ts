import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ArtistDetailResponse} from '../../../../endpoints/artist-endpoints/artist-get-by-id-endpoint.service';
import {GetArtistBioResponse} from '../../../../endpoints/artist-endpoints/get-artist-bio-endpoint.service';
import {MyConfig} from '../../../../my-config';

export interface ArtistDialogData {
  artist: ArtistDetailResponse;
  artistStats: GetArtistBioResponse;
}

@Component({
  selector: 'app-artist-dialog',
  templateUrl: './artist-dialog.component.html',
  styleUrls: ['./artist-dialog.component.css']
})
export class ArtistDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ArtistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ArtistDialogData
  ) {}

  closeDialog($event: MouseEvent): void {
    this.dialogRef.close();
    $event.stopPropagation();
  }

  protected readonly MyConfig = MyConfig;

  goToTwitter() {

  }

  shareOnMessenger() {

  }

  shareOnTwitter() {

  }
}
