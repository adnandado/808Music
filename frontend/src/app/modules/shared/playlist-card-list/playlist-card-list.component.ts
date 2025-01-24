import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import {
  GetPlaylistsByUserIdEndpointService, PlaylistResponse
} from '../../../endpoints/playlist-endpoints/get-playlist-by-user-endpoint.service';
import {MyConfig} from '../../../my-config';

@Component({
  selector: 'app-playlist-card-list',
  templateUrl: './playlist-card-list.component.html',
  styleUrls: ['./playlist-card-list.component.css']
})
export class PlaylistCardListComponent implements OnInit {
  @Input() title: string = "PLAYLISTS";
  @Input() userId: number = 0;
  @Input() queryParams: Params | null = null;
  artistMode: boolean = false;

  playlists: PlaylistResponse[] = [];

  @Output() deletedPlaylist = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private getPlaylistsByUserIdService: GetPlaylistsByUserIdEndpointService
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes("/artist/search")) {
      this.artistMode = true;
    }

    if (this.userId) {
      this.getPlaylistsByUserIdService.handleAsync(this.userId).subscribe({
        next: (data) => {
          this.playlists = data;
        },
        error: (err) => {
          console.error("Failed to fetch playlists", err);
        }
      });
    }
  }

  goToPlaylist(id: number) {
    if (!this.artistMode) {
      this.router.navigate(["listener/playlist", id]);
    } else {
      this.router.navigate(["artist/playlist/edit", id]);
    }
  }

  deletePlaylist(id: number) {
    let matRef = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      data: {
        title: "Are you sure you want to delete this playlist?",
        content: "This will delete all songs within the playlist."
      }
    });

    matRef.afterClosed().subscribe((res) => {
      if (res) {
        this.snackBar.open("Playlist deleted successfully.", "Dismiss", {
          duration: 3000
        });

        this.ngOnInit();
        this.deletedPlaylist.emit(true);
      }
    });
  }

  getDate(createdDate: string) {
    return new Date(createdDate).toLocaleDateString();
  }

  protected readonly MyConfig = MyConfig;

  goToEditPlaylist($event: number) {

  }
}
