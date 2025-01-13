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
import {PlaylistUpdateDialogComponent} from '../tracks-page/playlist-update-dialog/playlist-update-dialog.component';
import {PlaylistCreateDialogComponent} from '../tracks-page/playlist-create-dialog/playlist-create-dialog.component';

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
    const dialogRef = this.dialog.open(PlaylistCreateDialogComponent, {
      width: '900px', // Prilagodi širinu prema potrebi
      data: {}, // Proslijedi dodatne podatke ako su potrebni
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Playlist successfully created:', result);
        // Dodaj logiku za osvježavanje liste playlista ili prikaz poruke korisniku
      }
    });
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

  private getUserIdFromToken(): number {
    let authToken = sessionStorage.getItem('authToken');

    if (!authToken) {
      authToken = localStorage.getItem('authToken');
    }

    if (!authToken) {
      return 0;
    }

    try {
      const parsedToken = JSON.parse(authToken);
      return parsedToken.userId;
    } catch (error) {
      console.error('Error parsing authToken:', error);
      return 0;
    }
  }

}
