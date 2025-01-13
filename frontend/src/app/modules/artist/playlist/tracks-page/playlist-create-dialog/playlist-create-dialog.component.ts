import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlaylistCreateService } from '../../../../../endpoints/playlist-endpoints/create-playlist-endpoint.service';
import { MyConfig } from '../../../../../my-config';

@Component({
  selector: 'app-playlist-create-dialog',
  templateUrl: './playlist-create-dialog.component.html',
  styleUrls: ['./playlist-create-dialog.component.css'],
})
export class PlaylistCreateDialogComponent implements OnInit {
  playlistForm: FormGroup;
  previewUrl: string | null = null;
  newCoverFile: File | null = null;

  constructor(
    public dialogRef: MatDialogRef<PlaylistCreateDialogComponent>,
    private fb: FormBuilder,
    private playlistCreateService: PlaylistCreateService
  ) {
    this.playlistForm = this.fb.group({
      title: ['', Validators.required],
      isPublic: [false],
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.newCoverFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  createPlaylist(): void {
    if (this.playlistForm.invalid) {
      return;
    }

    const request = {
      title: this.playlistForm.value.title,
      isPublic: this.playlistForm.value.isPublic,
      coverImage: this.newCoverFile || undefined,
      trackIds: [],
      userId: this.getUserIdFromToken(),
    };

    this.playlistCreateService.handleAsync(request).subscribe({
      next: (response) => {
        console.log('Playlist created successfully', response);
        this.dialogRef.close(response);
      },
      error: (err) => {
        console.error('Error creating playlist:', err);
      },
    });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('coverImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  protected readonly MyConfig = MyConfig;

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
