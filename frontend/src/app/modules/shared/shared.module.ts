import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {RouterLink} from '@angular/router';
import { ArtistPicDragzoneComponent } from './artist/artist-pic-dragzone/artist-pic-dragzone.component';
import {
  MatCard,
  MatCardActions,
  MatCardAvatar, MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardTitleGroup
} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@NgModule({
  declarations: [
    UnauthorizedComponent,
    ArtistPicDragzoneComponent, // Dodajemo UnauthorizedComponent u deklaracije
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
    MatCardContent
  ],
  exports: [
    UnauthorizedComponent, // Omogućavamo ponovno korištenje UnauthorizedComponent
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArtistPicDragzoneComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
}
