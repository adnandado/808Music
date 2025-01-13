import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {
  PlaylistTracksGetEndpointService, PlaylistTracksGetRequest,
  PlaylistTracksGetResponse
} from '../../../../endpoints/playlist-endpoints/playlist-get-tracks-endpoint.service';
import { GetPlaylistByIdEndpointService, PlaylistByIdResponse } from '../../../../endpoints/playlist-endpoints/get-playlist-by-id-endpoint.service';
import { PlaylistUpdateTracksService, PlaylistUpdateTracksRequest } from '../../../../endpoints/playlist-endpoints/add-track-to-playlist-endpoint.service';
import { MyConfig } from '../../../../my-config';
import { HttpErrorResponse } from '@angular/common/http';
import { AlbumCoverService } from '../../../../endpoints/album-endpoints/album-get-cover-by-track-endpoint.service';
import { RemoveTrackFromPlaylistService } from '../../../../endpoints/playlist-endpoints/delete-track-from-playlist-endpoint.service';
import { DeletePlaylistService } from '../../../../endpoints/playlist-endpoints/playlist-delete-endpoint.service';
import { MyPagedList } from '../../../../services/auth-services/dto/my-paged-list';
import { GetPlaylistsByUserIdEndpointService } from '../../../../endpoints/playlist-endpoints/get-playlist-by-user-endpoint.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MusicPlayerService } from '../../../../services/music-player.service';
import {TrackGetResponse} from '../../../../endpoints/track-endpoints/track-get-by-id-endpoint.service';
import {PlaylistUpdateDialogComponent} from './playlist-update-dialog/playlist-update-dialog.component';

@Component({
  selector: 'app-tracks-page',
  templateUrl: './tracks-list.component.html',
  styleUrls: ['./tracks-list.component.css'],
})
export class TracksPageComponent implements OnInit {
  playlist: PlaylistTracksGetResponse | null = null;
  playlistDetails: PlaylistByIdResponse | null = null;
  username: string = 'Loading...';
  userId: number = 0;
  coverPaths: { [trackId: number]: string } = {};
  showDeleteIcon: boolean = true;
  isLikedSongs = false;
  searchControl = new FormControl('');
  filteredTracks: TrackGetResponse[] = [];

  featuredTracks: TrackGetResponse[] = [];
  myFeaturedRequest: { pageNumber: number; pageSize: number; PlaylistID : number } = {
    pageNumber: 1,
    pageSize: 1000,
    PlaylistID: this.playlist?.playlistId!
  };

  constructor(
    private playlistTracksService: PlaylistTracksGetEndpointService,
    private playlistDetailsService: GetPlaylistByIdEndpointService,
    private playlistUpdateTracksService: PlaylistUpdateTracksService,
    private route: ActivatedRoute,
    private getPlaylistsByUserIdService: GetPlaylistsByUserIdEndpointService,
    private router: Router,
    private albumCoverService: AlbumCoverService,
    private removeTrackFromPlaylistService: RemoveTrackFromPlaylistService,
    private deletePlaylistService: DeletePlaylistService,
    private dialog: MatDialog,
    private musicPlayerService: MusicPlayerService,

  ) {}

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();
    const playlistId = +this.route.snapshot.paramMap.get('id')!;

    if (playlistId) {
      this.loadPlaylistTracks(playlistId);
      this.loadPlaylistDetails(playlistId);
    }

    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((searchTerm) => this.searchTracks(searchTerm || ''))
      )
      .subscribe({
        next: (tracks) => {
          this.filteredTracks = tracks.dataItems || [];
        },
        error: (err) => {
          console.error('Error fetching tracks:', err);
          this.filteredTracks = [];
        },
      });
  }

  private loadPlaylistTracks(playlistId: number): void {
    const request = { playlistId, pageNumber: 1, pageSize: 50 };
    this.playlistTracksService.handleAsync(request).subscribe({
      next: (response) => {
        this.featuredTracks = response.dataItems || [];
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching playlist tracks:', err);
      },
    });
  }

    private loadPlaylistDetails(playlistId: number): void {
    this.playlistDetailsService.handleAsync(playlistId).subscribe({
      next: (response) => {
        this.playlistDetails = response;
        this.isLikedSongs = response.isLikePlaylist;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error fetching playlist details:', err);
      },
    });
      this.getPlaylistsByUserIdService.handleAsync(this.userId).subscribe({
        next: (response) => {
          this.username = response[0]?.username || 'Unknown';
          console.log(this.isLikedSongs);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error loading username:', err);
          this.username = 'Error';
        },
      });
  }

  searchTracks(searchTerm: string): Observable<MyPagedList<TrackGetResponse>> {
    const request: PlaylistTracksGetRequest = { title: searchTerm, playlistId: this.playlistDetails?.id || 0, pageNumber: 1, pageSize: 10 };
    return this.playlistTracksService.handleAsync(request);
  }

  addTrackToPlaylist(trackId: number): void {
    if (!this.playlistDetails) return;

    const request: PlaylistUpdateTracksRequest = {
      playlistId: this.playlistDetails.id,
      trackIds: [trackId],
    };

    this.playlistUpdateTracksService.handleAsync(request).subscribe({
      next: () => {
        console.log(`Track with ID ${trackId} added to playlist`);
        if (this.playlistDetails?.id) {
          this.loadPlaylistTracks(this.playlistDetails.id); // Osvježi listu pjesama
        } else {
          console.error('Playlist details or ID is null');
        }
      },
      error: (err) => {
        console.error('Error adding track to playlist:', err);
      },
    });
  }

  removeTrack(trackId: number): void {
    const playlistId = this.playlistDetails?.id;
    if (playlistId) {
      this.removeTrackFromPlaylistService.handleAsync(playlistId, trackId).subscribe({
        next: () => {
          console.log(`Track ${trackId} successfully removed from playlist ${playlistId}`);
          this.loadPlaylistTracks(playlistId); // Osvježi listu pjesama
        },
        error: (error) => {
          console.error('Error removing track:', error);
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate([`/listener/playlist/`]);
  }

  getTotalTrackLength(): string {
    const totalSeconds = this.featuredTracks?.reduce((total, track) => total + track.length, 0) || 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  deletePlaylist(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent); // Otvoriti dijalog za potvrdu

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (this.playlistDetails?.id) {
          this.deletePlaylistService.handleAsync(this.playlistDetails.id).subscribe({
            next: () => {
              this.router.navigate(['/listener/playlist']);
            },
            error: (error) => {
              console.error('Error deleting playlist:', error);
            },
          });
        }
      } else {
        console.log('Playlist deletion canceled');
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

  protected readonly MyConfig = MyConfig;

  sharePlaylist() {
    // Implementirati logiku za dijeljenje playliste
  }

  createFeaturedQueue(e: number) {
    this.musicPlayerService.createQueue(this.featuredTracks);
    let i = this.featuredTracks.filter(val => val.id == e)[0];
    if (i) {
      this.musicPlayerService.skipTo(i);
    }
  }

  editPlaylist(): void {
    const dialogRef = this.dialog.open(PlaylistUpdateDialogComponent, {
      width: '900px',
      data: {
        playlistDetails: this.playlistDetails,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadPlaylistDetails(this.playlistDetails?.id!);
      }
    });
  }
}
