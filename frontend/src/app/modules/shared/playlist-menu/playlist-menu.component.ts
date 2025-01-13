import { Component, Input, OnInit } from '@angular/core';
import { PlaylistUpdateTracksService } from '../../../endpoints/playlist-endpoints/add-track-to-playlist-endpoint.service';
import { PlaylistResponse } from '../../../endpoints/playlist-endpoints/get-all-playlists-endpoint.service';
import { GetPlaylistsByUserIdEndpointService } from '../../../endpoints/playlist-endpoints/get-playlist-by-user-endpoint.service';

@Component({
  selector: 'app-playlist-menu',
  template: `
    <mat-nav-list>
      <mat-list-item *ngFor="let playlist of playlists" (click)="addToPlaylist(playlist.id)">
        {{ playlist.title }}
      </mat-list-item>
    </mat-nav-list>
  `
})
export class PlaylistMenuComponent implements OnInit {
  @Input() trackId: number = 0;
  playlists: PlaylistResponse[] = [];

  constructor(
    private playlistUpdateService: PlaylistUpdateTracksService,
    private playlistsService: GetPlaylistsByUserIdEndpointService
  ) {}

  ngOnInit() {
    const userId = this.getUserIdFromToken();
    if (userId) {
      this.loadPlaylists(userId);
    }
  }

  loadPlaylists(userId: number) {
    this.playlistsService.handleAsync(userId).subscribe({
      next: (playlists) => {
        this.playlists = playlists;
      },
      error: (err) => {
        console.error('Error loading playlists', err);
      }
    });
  }

  addToPlaylist(playlistId: number) {
    if (this.trackId) {
      const request = {
        playlistId: playlistId,
        trackIds: [this.trackId]
      };
      this.playlistUpdateService.handleAsync(request).subscribe(() => {
        console.log('Track added to playlist');
      }, error => {
        console.error('Error adding track to playlist', error);
      });
    }
  }

  private getUserIdFromToken(): number {
    let authToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
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
