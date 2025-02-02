import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MyConfig} from '../../../../../my-config';
import {
  DeleteConfirmationDialogComponent
} from '../../../../shared/delete-confirmation-dialog/delete-confirmation-dialog.component';

export interface Collaborator {
  userId: number;
  username: string;
  profilePicture: string;
  isOwner: boolean;
}

@Component({
  selector: 'app-collaborator-list-dialog',
  templateUrl: './collaborator-list-dialog.component.html',
  styleUrls: ['./collaborator-list-dialog.component.css'],
})
export class CollaboratorListDialogComponent implements OnInit {
  sortedCollaborators: Collaborator[];
  userId = 0;
  constructor(
    private dialog : MatDialog,
    public dialogRef: MatDialogRef<CollaboratorListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { collaborators: Collaborator[] }
  ) {
    this.sortedCollaborators = [...data.collaborators].sort((a, b) =>
      a.isOwner === b.isOwner ? 0 : a.isOwner ? -1 : 1
    );
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

  closeDialog(): void {
    this.dialogRef.close();
  }

  protected readonly MyConfig = MyConfig;

  ngOnInit(): void {
    this.userId = this.getUserIdFromToken();

  }
  removeCollab(userId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.removeCollaborator(userId)
      } else {
        console.log('canceled');
      }
    });
  }

  removeCollaborator(userId: number) {
    this.dialogRef.close({ removed: true, userId: userId });

  }
}
