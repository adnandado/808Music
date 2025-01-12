import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UnauthorizedComponent} from './unauthorized/unauthorized.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
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
import {MatButton, MatFabButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
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
import {MatFormField, MatPrefix} from '@angular/material/form-field';
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
import {AppModule} from '../../app.module';
import {SecondsToDurationStringPipe} from '../../services/pipes/seconds-to-string.pipe';
import {LongDurationStringPipe} from '../../services/pipes/long-duration-string.pipe';
import { QueueViewBottomSheetComponent } from './bottom-sheets/queue-view-bottom-sheet/queue-view-bottom-sheet.component';
import {MatListItem, MatNavList} from '@angular/material/list';
import {MatDivider} from '@angular/material/divider';
import { ShareBottomSheetComponent } from './bottom-sheets/share-bottom-sheet/share-bottom-sheet.component';
import {QRCodeModule} from 'angularx-qrcode';
import {SidenavComponent} from './sidenav/sidenav.component';
import {PlaylistCardComponent} from './playlist-card/playlist-card.component';
import { PlaylistDialogComponent } from './playlist-detail/playlist-dialog.component';
import {ArtistSidenavComponent} from './artist-sidenav/artist-sidenav.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { WishlistComponent } from './wishlist/wishlist.component';import {DeleteConfirmationDialogComponent} from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import {MatSelect} from "@angular/material/select";
import { UserPreferenceBottomSheetComponent } from './bottom-sheets/user-preference-bottom-sheet/user-preference-bottom-sheet.component';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import { ManageFollowingBottomSheetComponent } from './bottom-sheets/manage-following-bottom-sheet/manage-following-bottom-sheet.component';
import { AlbumCardListComponent } from './album-card-list/album-card-list.component';
import { ArtistBigCardComponent } from './artist/artist-big-card/artist-big-card.component';
import { ArtistBigCardListComponent } from './artist/artist-big-card-list/artist-big-card-list.component';
import { SearchPageComponent } from './search-page/search-page.component';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import { TrackCardComponent } from './tracks/track-card/track-card.component';
import { TrackCardListComponent } from './tracks/track-card-list/track-card-list.component';
import { CreateChatBottomSheetComponent } from './bottom-sheets/create-chat-bottom-sheet/create-chat-bottom-sheet.component';
import { SearchForContentSheetComponent } from './bottom-sheets/search-for-content-sheet/search-for-content-sheet.component';
import { MessageContentCardComponent } from './message-content-card/message-content-card.component';

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
    SecondsToDurationStringPipe,
    LongDurationStringPipe,
    StripeComponent,
    QueueViewBottomSheetComponent,
    SidenavComponent,
    PlaylistCardComponent,
    DeleteConfirmationDialogComponent,
    ShareBottomSheetComponent,
    PlaylistDialogComponent,
    ArtistSidenavComponent,
    SidenavComponent,
    ShoppingCartComponent,
    WishlistComponent,
    ShareBottomSheetComponent,
    DeleteConfirmationDialogComponent,
    SidenavComponent,
    PlaylistCardComponent,
    LanguageSelectorComponent,
    UserPreferenceBottomSheetComponent,
    ManageFollowingBottomSheetComponent,
    AlbumCardListComponent,
    ArtistBigCardComponent,
    ArtistBigCardListComponent,
    SearchPageComponent,
    TrackCardComponent,
    TrackCardListComponent,
    CreateChatBottomSheetComponent,
    SearchForContentSheetComponent,
    MessageContentCardComponent,
// Dodajemo UnauthorizedComponent u deklaracije
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
    MatOption,
    MatNavList,
    MatDivider,
    QRCodeModule,
    MatSelect,
    MatPrefix,
    MatSlideToggle,
    MatChipListbox,
    MatChipOption,
    MatMiniFabButton,
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
    StripeComponent,
    ClickableFeaturedArtistsComponent,
    SecondsToDurationStringPipe,
    LongDurationStringPipe,
    SidenavComponent,
    PlaylistCardComponent,
    DeleteConfirmationDialogComponent,
    PlaylistDialogComponent,
    ArtistSidenavComponent,
    SidenavComponent,
    ShoppingCartComponent,
    WishlistComponent,
    DeleteConfirmationDialogComponent,
    SidenavComponent,
    PlaylistCardComponent,
    LanguageSelectorComponent,
    AlbumCardListComponent,
    ArtistBigCardComponent,
    ArtistBigCardListComponent,
    MessageContentCardComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {
}
