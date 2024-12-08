import {Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {
  ArtistInsertOrUpdateEndpointService,
  ArtistInsertRequest
} from '../../../endpoints/artist-endpoints/artist-insert-or-update-endpoint.service';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-artist-create-or-edit',
  templateUrl: './artist-create-or-edit.component.html',
  styleUrl: './artist-create-or-edit.component.css'
})
export class ArtistCreateOrEditComponent implements OnChanges {
  @Input() artist: ArtistInsertRequest = {
    name: "",
    bio: "",
  }
  fileUrl = "";
  @Output() cancelEvent = new EventEmitter<null>();
  @Output() successOpEvent = new EventEmitter<boolean>();

  readonly snackBar = inject(MatSnackBar);

  constructor(private frmBulider: FormBuilder,
              private artistCreate: ArtistInsertOrUpdateEndpointService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
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
        if(this.artist.id)
        {
          this.snackBar.open("Successfully updated artist profile " + value.name + "!", "Dismiss", {duration: 3500});
        }
        else {
          this.snackBar.open("Successfully created artist profile " + value.name + "!", "Dismiss", {duration: 3500});
        }

        this.successOpEvent.emit(true);
        this.emitCancel();
      },
      error: (err: HttpErrorResponse) => {
        this.snackBar.open(err.error, "Dismiss", {duration: 3500});
      }
    })
  }

  emitCancel() {
    this.cancelEvent.emit();
  }
}
