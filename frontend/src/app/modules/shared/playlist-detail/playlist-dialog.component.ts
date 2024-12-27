import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {TrackGetResponse} from '../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {PlaylistResponse} from '../../../endpoints/playlist-endpoints/get-playlist-by-user-endpoint.service';

@Component({
  selector: 'app-playlist-dialog',
  templateUrl: './playlist-dialog.component.html',
  styleUrls: ['./playlist-dialog.component.css']
})
export class PlaylistDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { track: TrackGetResponse, playlists: PlaylistResponse[] }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onAddToPlaylist(playlistId: number): void {
    this.dialogRef.close({ playlistId });
  }
}
