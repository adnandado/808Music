import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AddCollaboratorDialogComponent } from '../tracks-page/add-collaborator-dialog/add-collaborator-dialog.component';
import { Router } from '@angular/router';
import {
  GetPlaylistByIdEndpointService, PlaylistByIdResponse
} from '../../../../endpoints/playlist-endpoints/get-playlist-by-id-endpoint.service';

@Component({
  selector: 'app-add-collaborator',
  templateUrl: './add-collaborator.component.html',
  styleUrls: ['./add-collaborator.component.css']
})
export class AddCollaboratorComponent implements OnInit {
  playlistId: number = 0;
  ownerId: number = 0;
  collaboratorId: number = 0;

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private playlistDetailsService: GetPlaylistByIdEndpointService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.playlistId = +params['p'];
      this.ownerId = +params['oiwd'];
      this.collaboratorId = this.getUserIdFromToken();

      this.checkIfUserIsCollaborator();
    });
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

  private checkIfUserIsCollaborator(): void {
    this.playlistDetailsService.handleAsync(this.playlistId).subscribe({
      next: (response: PlaylistByIdResponse) => {
        const isUserCollaborator = response.users.some(user => user.userId === this.collaboratorId);
        if (isUserCollaborator) {
          this.router.navigate(['/listener/playlist/', this.playlistId]);
        } else {
          this.openDialog();
        }
      },
      error: (err) => {
        console.error('Failed to fetch playlist details:', err);
      }
    });
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(AddCollaboratorDialogComponent, {
      width: '500px',
      disableClose: true,
      data: {
        playlistId: this.playlistId,
        ownerId: this.ownerId
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('User accepted the invite');
      } else {
        console.log('User declined the invite');
      }
    });
  }
}
