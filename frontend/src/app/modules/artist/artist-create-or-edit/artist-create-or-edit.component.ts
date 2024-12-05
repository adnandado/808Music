import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {
  ArtistInsertOrUpdateEndpointService,
  ArtistInsertRequest
} from '../../../endpoints/artist-endpoints/artist-insert-or-update-endpoint.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-artist-create-or-edit',
  templateUrl: './artist-create-or-edit.component.html',
  styleUrl: './artist-create-or-edit.component.css'
})
export class ArtistCreateOrEditComponent {
  @Input() artist: ArtistInsertRequest = {
    name: "",
    bio: "",
  }
  fileUrl = "";
  @Output() cancelEvent = new EventEmitter<null>();
  @Output() successOpEvent = new EventEmitter<boolean>();

  constructor(private frmBulider: FormBuilder,
              private artistCreate: ArtistInsertOrUpdateEndpointService) {
  }

  selectPfpFile(e: File | undefined): void {
    this.artist.profilePhoto = e
  }
  selectBgFile(e: File | undefined): void {
    this.artist.profileBackground = e
  }

  createArtist() {
    this.artistCreate.handleAsync(this.artist).subscribe({
      next: value => {
        alert("Succesfully created/updated artist profile!");
        this.successOpEvent.emit(true);
        this.emitCancel();
      },
      error: (err: HttpErrorResponse) => {
        alert(err.error);
      }
    })
  }

  emitCancel() {
    this.cancelEvent.emit();
  }
}
