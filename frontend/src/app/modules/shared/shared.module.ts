import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {RouterLink} from '@angular/router';
import { ArtistPicDragzoneComponent } from './artist/artist-pic-dragzone/artist-pic-dragzone.component';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar, MatCardContent, MatCardFooter,
  MatCardHeader, MatCardImage,
  MatCardTitle,
  MatCardTitleGroup
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButton, MatIconButton} from "@angular/material/button";
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog.component';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContainer,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';
import { AlbumCardComponent } from './album-card/album-card.component';

@NgModule({
  declarations: [
    UnauthorizedComponent,
    ArtistPicDragzoneComponent,
    ConfirmDialogComponent,
    InfoDialogComponent,
    AlbumCardComponent, // Dodajemo UnauthorizedComponent u deklaracije
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatCard,
    MatCardActions,
    MatCardAvatar,
    MatCardHeader,
    MatCardTitle,
    MatIcon,
    MatIconButton,
    MatCardTitleGroup,
    MatCardContent,
    MatDialogContainer,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatCardFooter,
    MatCardImage
  ],
  exports: [
    UnauthorizedComponent, // Omogućavamo ponovno korištenje UnauthorizedComponent
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArtistPicDragzoneComponent,
    AlbumCardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
}
