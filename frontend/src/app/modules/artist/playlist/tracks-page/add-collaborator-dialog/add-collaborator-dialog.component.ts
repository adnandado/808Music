import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlaylistAddOrRemoveCollaboratorService } from '../../../../../endpoints/playlist-endpoints/add-or-remove-collaborator-endpoint.service';
import { Router } from '@angular/router';
import { GetPlaylistByIdEndpointService, PlaylistByIdResponse } from '../../../../../endpoints/playlist-endpoints/get-playlist-by-id-endpoint.service';
import {MyConfig} from '../../../../../my-config';

@Component({
  selector: 'app-add-collaborator-dialog',
  templateUrl: './add-collaborator-dialog.component.html',
  styleUrls: ['./add-collaborator-dialog.component.css']
})
export class AddCollaboratorDialogComponent implements OnInit {
  playlistId: number = 0;
  ownerId: number = 0;
  collaboratorId: number = 0;
  playlistName: string = '';
  ownerName: string = '';
  playlistDetails: PlaylistByIdResponse | null = null;

  constructor(
    private dialogRef: MatDialogRef<AddCollaboratorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addCollaboratorService: PlaylistAddOrRemoveCollaboratorService,
    private router: Router,
    private playlistDetailsService: GetPlaylistByIdEndpointService
  ) {}

  ngOnInit(): void {
    this.playlistId = this.data.playlistId;
    this.ownerId = this.data.ownerId;

    this.playlistDetailsService.handleAsync(this.playlistId).subscribe({
      next: (response) => {
        this.playlistDetails = response;
        this.playlistName = response.title;
        this.ownerName = this.getOwnerName(response.users);
        this.checkIfUserIsCollaborator(response.users);
      }
    });

    this.collaboratorId = this.getUserIdFromToken();
  }

  private getUserIdFromToken(): number {
    let authToken = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
    if (!authToken) return 0;

    try {
      const parsedToken = JSON.parse(authToken);
      return parsedToken.userId;
    } catch (error) {
      console.error('Error parsing authToken:', error);
      return 0;
    }
  }
  private checkIfUserIsCollaborator(users: any[]): void {
    const isUserCollaborator = users.some(user => user.userId === this.collaboratorId);
    if (isUserCollaborator) {
      this.goToPlaylist();
    }
  }
  private getOwnerName(users: any[]): string {
    const owner = users.find(user => user.userId === this.ownerId);
    return owner ? owner.username : 'Unknown Owner';
  }

  private addCollaborator() {
    const request = {
      ownerId: this.ownerId,
      playlistId: this.playlistId,
      collaboratorId: this.collaboratorId
    };

    this.addCollaboratorService.handleAsync(request).subscribe({
      next: () => {

        this.dialogRef.close(true);
        this.goToPlaylist();
        },
      error: (err) => {
        console.error('Failed to add collaborator:', err);
        alert('Failed to join the playlist.');
      }
    });
  }

  acceptInvite(): void {
    this.addCollaborator();
  }
  goToPlaylist(): void {
    this.router.navigate(['/listener/playlist/', this.playlistDetails?.id]);
}
  declineInvite(): void {
    this.dialogRef.close(false);
    this.router.navigate(['/listener/playlist']);
  }

  protected readonly MyConfig = MyConfig;
}
