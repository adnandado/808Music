import {Component, ElementRef, Inject, ViewChild} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UserProfilePictureService } from '../../../endpoints/user-endpoints/upload-profile-picture-endpoint.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-image-cropper-dialog',
  templateUrl: './pfp-cropper-dialog.component.html',
  styleUrls: ['./pfp-cropper-dialog.component.css']
})
export class PfpCropperDialogComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<PfpCropperDialogComponent>,

  @Inject(MAT_DIALOG_DATA) public data: any,
    private userProfilePictureService: UserProfilePictureService,
    private snackBar: MatSnackBar
  ) {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = {
      target: {
        files: event.target.files
      }
    };
    console.log('imageChangedEvent:', this.imageChangedEvent);
  }



  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.croppedImage = event.blob;
    } else {
      console.error('Cropped image blob is undefined');
    }
  }

  saveCroppedImage() {
    if (!this.croppedImage) {
      console.error('Cropped image is empty or undefined');
      return;
    }

    const userId = this.getUserIdFromToken();
    if (!userId) {
      console.error('User ID is invalid');
      return;
    }

    const file = new File([this.croppedImage], 'profile-picture.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('ProfileImage', file);
    formData.append('UserId', userId.toString());

    this.userProfilePictureService.uploadProfilePicture(formData).subscribe(
      (response) => {
        console.log('Profile picture uploaded successfully:', response);
        this.snackBar.open('Profile picture updated successfully', 'Close', {
          duration: 1500,
          verticalPosition: 'bottom',
          horizontalPosition: 'center'
        });
        this.dialogRef.close(response);
      },
      (error) => {
        console.error('Error uploading profile picture:', error);
        this.dialogRef.close(null);
      }
    );
  }

  closeDialog() {
    this.dialogRef.close();
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
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];

      const inputElement = document.createElement('input');
      inputElement.type = 'file';

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      inputElement.files = dataTransfer.files;

      this.fileChangeEvent({ target: { files: inputElement.files } });
    }
  }






  triggerFileInput() {
    this.fileInput.nativeElement.click();

  }
}
