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
import {MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
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
import {MatTooltip} from "@angular/material/tooltip";
import { MyMatInputComponent } from './inputs/my-mat-input/my-mat-input.component';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import { TextInputDialogComponent } from './dialogs/text-input-dialog/text-input-dialog.component';
import { TracksTableComponent } from './tracks-table/tracks-table.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import { PleaseWaitAMomentComponent } from './please-wait-amoment/please-wait-amoment.component';
import { ArtistSmallCardComponent } from './artist/artist-small-card/artist-small-card.component';
import { ClickableFeaturedArtistsComponent } from './artist/clickable-featured-artists/clickable-featured-artists.component';
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatPaginator} from '@angular/material/paginator';
import { SearchBarComponent } from './search-bar/search-bar.component';
import {MusicTrackDragzoneComponent} from './inputs/music-track-dragzone/music-track-dragzone.component';
import {NgxAudioPlayerModule} from '@khajegan/ngx-audio-player';
import { MyMatArtistAutocompleteComponent } from './inputs/my-mat-artist-autocomplete/my-mat-artist-autocomplete.component';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import { StripeComponent } from './stripe/stripe.component';

@NgModule({
  declarations: [
    UnauthorizedComponent,
    ArtistPicDragzoneComponent,
    ConfirmDialogComponent,
    InfoDialogComponent,
    AlbumCardComponent,
    MyMatInputComponent,
    TextInputDialogComponent,
    TracksTableComponent,
    PleaseWaitAMomentComponent,
    ArtistSmallCardComponent,
    ClickableFeaturedArtistsComponent,
    SearchBarComponent,
    MusicTrackDragzoneComponent,
    MyMatArtistAutocompleteComponent,
    StripeComponent // Dodajemo UnauthorizedComponent u deklaracije
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
    MatCardImage,
    MatTooltip,
    MatFormField,
    MatInput,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCellDef,
    MatHeaderCellDef,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatSort,
    MatSortHeader,
    MatPaginator,
    MatFabButton,
    NgxAudioPlayerModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption
  ],
  exports: [
    UnauthorizedComponent, // Omogućavamo ponovno korištenje UnauthorizedComponent
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ArtistPicDragzoneComponent,
    AlbumCardComponent,
    TracksTableComponent,
    ArtistSmallCardComponent,
    SearchBarComponent,
    MyMatInputComponent,
    MusicTrackDragzoneComponent,
    MyMatArtistAutocompleteComponent,
    StripeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
}
