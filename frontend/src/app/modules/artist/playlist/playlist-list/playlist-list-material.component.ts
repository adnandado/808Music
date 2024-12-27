import { Component, OnInit, inject } from '@angular/core';
import { DeletePlaylistService } from '../../../../endpoints/playlist-endpoints/playlist-delete-endpoint.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { MyConfig } from '../../../../my-config';
import { GetPlaylistsByUserIdEndpointService } from '../../../../endpoints/playlist-endpoints/get-playlist-by-user-endpoint.service';
import { PlaylistUpdateEndpointService } from '../../../../endpoints/playlist-endpoints/update-playlist-endpoint.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PlaylistResponse } from '../../../../endpoints/playlist-endpoints/get-playlist-by-user-endpoint.service';

@Component({
  selector: 'app-playlist-list-material',
  templateUrl: './playlist-list-material.component.html',
  styleUrls: [
   './playlist-list-material.component.css'
  ]
})
export class PlaylistListMaterialComponent implements OnInit {
  playlists: PlaylistResponse[] | null = null;
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);
  userId: number | null = null;

  constructor(
    private playlistService: GetPlaylistsByUserIdEndpointService,
    private playlistDeleteService: DeletePlaylistService,
    private router: Router,
    private playlistUpdateService: PlaylistUpdateEndpointService
  ) {}

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();
    this.loadPlaylists();
    console.log(this.userId);
  }

  loadPlaylists() {
    if (this.userId) {
      this.playlistService.handleAsync(this.userId).subscribe(playlists => {
        console.log('Playlists loaded:', playlists);
        this.playlists = playlists || [];
      });
    }
  }

  deletePlaylist(id: number) {
    let playlist = this.playlists?.find(x => x.id === id);
    let matRef = this.dialog.open(ConfirmDialogComponent, {
      hasBackdrop: true,
      data: {
        title: `Are you sure you want to delete "${playlist?.title}"?`,
        content: 'This will delete every track in the playlist.'
      }
    });

    matRef.afterClosed().subscribe(res => {
      if (res) {
        this.playlistDeleteService.handleAsync(id).subscribe({
          error: () => {
            alert('Playlist deletion failed.');
          },
          complete: () => {
            this.snackBar.open(`"${playlist?.title}" deleted successfully.`, 'Dismiss', { duration: 3000 });
            this.loadPlaylists();
            window.location.reload();

          }
        });
      }
    });
  }

  openPlaylist(playlistId: number) {
    this.router.navigate([`/listener/playlist/${playlistId}`]);
  }

  editPlaylist(id: number) {
    this.router.navigate([`/listener/playlist/edit`, id]);
  }

  createPlaylist() {
    this.router.navigate([`/listener/playlist/create`]);
  }

  getReleaseYear(releaseDate: string) {
    return new Date(releaseDate).getFullYear().toString();
  }

  protected readonly MyConfig = MyConfig;

  updatePlaylist(id: number) {
    let formData = new FormData();
    formData.append('title', 'Updated Playlist Title');
    formData.append('isPublic', 'true');

    this.playlistUpdateService.handleAsync(id, formData).subscribe({
      next: () => {
        this.snackBar.open('Playlist updated successfully.', 'Dismiss', { duration: 3000 });
        this.loadPlaylists();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating playlist:', err);
        this.snackBar.open('Error updating playlist.', 'Dismiss', { duration: 3000 });
      }
    });
  }

  private getUserIdFromToken(): number | null {
    const authToken = sessionStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('User not authenticated.');
    }

    try {
      const parsedToken = JSON.parse(authToken);
      if (!parsedToken.userId) {
        throw new Error('Invalid token: userId not found.');
      }
      return parsedToken.userId;
    } catch (error) {
      throw new Error('Failed to parse authToken.');
    }
  }
}
