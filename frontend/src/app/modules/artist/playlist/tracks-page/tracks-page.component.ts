import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { PlaylistTracksEndpointService, PlaylistTracksGetResponse } from '../../../../endpoints/playlist-endpoints/playlist-get-tracks-endpoint.service';
import { GetPlaylistByIdEndpointService, PlaylistByIdResponse } from '../../../../endpoints/playlist-endpoints/get-playlist-by-id-endpoint.service';
import { TrackGetAllEndpointService, TrackGetAllRequest, TrackGetResponse } from '../../../../endpoints/track-endpoints/track-get-all-endpoint.service';
import { PlaylistUpdateTracksService, PlaylistUpdateTracksRequest } from '../../../../endpoints/playlist-endpoints/add-track-to-playlist-endpoint.service';
import { MyConfig } from '../../../../my-config';
import { HttpErrorResponse } from '@angular/common/http';
import { AlbumCoverService } from '../../../../endpoints/album-endpoints/album-get-cover-by-track-endpoint.service';
import { RemoveTrackFromPlaylistService } from '../../../../endpoints/playlist-endpoints/delete-track-from-playlist-endpoint.service';
import { DeletePlaylistService } from '../../../../endpoints/playlist-endpoints/playlist-delete-endpoint.service'; // Import for DeletePlaylistService
import { MyPagedList } from '../../../../services/auth-services/dto/my-paged-list';
import { GetPlaylistsByUserIdEndpointService } from '../../../../endpoints/playlist-endpoints/get-playlist-by-user-endpoint.service';
import { MatDialog } from '@angular/material/dialog';
import {DeleteConfirmationDialogComponent} from '../../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';

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

  searchControl = new FormControl('');
  filteredTracks: TrackGetResponse[] = [];

  constructor(
    private playlistTracksService: PlaylistTracksEndpointService,
    private playlistDetailsService: GetPlaylistByIdEndpointService,
    private trackGetAllService: TrackGetAllEndpointService,
    private playlistUpdateTracksService: PlaylistUpdateTracksService,
    private route: ActivatedRoute,
    private getPlaylistsByUserIdService: GetPlaylistsByUserIdEndpointService,
    private router: Router,
    private albumCoverService: AlbumCoverService,
    private removeTrackFromPlaylistService: RemoveTrackFromPlaylistService,
    private deletePlaylistService: DeletePlaylistService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();
    const playlistId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPlaylist(playlistId);

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

  searchTracks(searchTerm: string): Observable<MyPagedList<TrackGetResponse>> {
    const request: TrackGetAllRequest = { title: searchTerm, pageNumber: 1, pageSize: 10 };
    return this.trackGetAllService.handleAsync(request);
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
          this.loadPlaylist(this.playlistDetails.id);
        } else {
          console.error('Playlist details or ID is null');
        }
      },
      error: (err) => {
        console.error('Error adding track to playlist:', err);
      },
    });
  }

  loadPlaylist(playlistId: number): void {
    this.playlistDetailsService.handleAsync(playlistId).subscribe({
      next: (response) => {
        this.playlistDetails = response;
        console.log('Playlist details loaded:', response);
        if (this.playlistDetails?.coverPath) {
          this.playlistDetails.coverPath = this.playlistDetails.coverPath.replace(/^\/+/, '');
        }

        this.getPlaylistsByUserIdService.handleAsync(this.userId).subscribe({
          next: (response) => {
            this.username = response[0]?.username || 'Unknown';
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error loading username:', err);
            this.username = 'Error';
          },
        });
      },
      error: (error) => {
        console.error('Error loading playlist details:', error);
      },
    });

    this.playlistTracksService.getPlaylistTracks({ PlaylistId: playlistId }).subscribe({
      next: (response) => {
        this.playlist = response;
        this.playlist?.tracks.forEach((track) => {
          this.albumCoverService.getCoverPathByTrackId(track.id).subscribe({
            next: (coverResponse) => {
              this.coverPaths[track.id] = 'http://localhost:7000/media/images/AlbumCovers/' + coverResponse.coverPath;
            },
            error: (error) => {
              console.error(`Error fetching cover for track ${track.id}:`, error);
            },
          });
        });
      },
      error: (error) => {
        console.error('Error loading tracks:', error);
      },
    });
  }

  goBack(): void {
    this.router
  }

    getTotalTrackLength(): string {
    const totalSeconds = this.playlist?.tracks?.reduce((total, track) => total + track.length, 0) || 0;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  removeTrack(trackId: number): void {
    const playlistId = this.playlistDetails?.id;
    if (playlistId) {
      this.removeTrackFromPlaylistService.handleAsync(playlistId, trackId).subscribe({
        next: () => {
          console.log(`Track ${trackId} successfully removed from playlist ${playlistId}`);
          this.loadPlaylist(playlistId);
        },
        error: (error) => {
          console.error('Error removing track:', error);
        },
      });
    }
  }

  deletePlaylist(): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);  // Otvoriti dijalog za potvrdu

    dialogRef.afterClosed().subscribe(result => {
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

  sharePlaylist(): void {

  }

  private getUserIdFromToken(): number {
    const authToken = sessionStorage.getItem('authToken');
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
}
