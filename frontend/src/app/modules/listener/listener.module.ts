  import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
  import {CommonModule, NgOptimizedImage} from '@angular/common';

import { ListenerRoutingModule } from './listener-routing.module';
import { ListenerLayoutComponent } from './listener-layout/listener-layout.component';
import { MusicPlayerComponent } from './music-player/music-player.component';
import { MusicControllerComponent } from './music-player/music-controller/music-controller.component';
import {MatIcon} from '@angular/material/icon';
import {SharedModule} from '../shared/shared.module';
import {
  ClickableFeaturedArtistsComponent
} from '../shared/artist/clickable-featured-artists/clickable-featured-artists.component';
import {MatButton, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatTooltip} from '@angular/material/tooltip';
import {MatFormField, MatInput} from "@angular/material/input";
import {MatSlider, MatSliderThumb} from '@angular/material/slider';
import { ReleaseViewComponent } from './release-view/release-view.component';
import {TracksModule} from '../artist/tracks/tracks.module';
import { PlayTrackComponent } from './play-track/play-track.component';
import {MatDivider} from '@angular/material/divider';
import { ArtistPageComponent } from './artist-page/artist-page.component';
import {MatTab, MatTabGroup} from '@angular/material/tabs';
import { ArtistMusicPageComponent } from './artist-page/artist-music-page/artist-music-page.component';
import { ArtistAlbumsListComponent } from './artist-albums-list/artist-albums-list.component';
import {AlbumModule} from '../artist/album/album.module';
import { NotificationsPageComponent } from './notifications-page/notifications-page.component';
import {MatChipListbox, MatChipOption} from '@angular/material/chips';
import { NotificationCardComponent } from './notifications-page/notification-card/notification-card.component';
import { ListenerHomeComponent } from './listener-home/listener-home.component';
import { ArtistSearchResultPageComponent } from './artist-search-result-page/artist-search-result-page.component';


@NgModule({
  declarations: [
    ListenerLayoutComponent,
    MusicPlayerComponent,
    MusicControllerComponent,
    ReleaseViewComponent,
    PlayTrackComponent,
    ArtistPageComponent,
    ArtistMusicPageComponent,
    ArtistAlbumsListComponent,
    NotificationsPageComponent,
    NotificationCardComponent,
    ListenerHomeComponent,
    ArtistSearchResultPageComponent
  ],
  imports: [
    CommonModule,
    ListenerRoutingModule,
    MatIcon,
    SharedModule,
    MatIconButton,
    MatTooltip,
    MatInput,
    MatFormField,
    MatButton,
    MatSlider,
    MatSliderThumb,
    TracksModule,
    MatDivider,
    MatFabButton,
    MatTabGroup,
    MatTab,
    AlbumModule,
    MatChipListbox,
    MatChipOption,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListenerModule { }
  import { ListenerRoutingModule } from './listener-routing.module';
  import { ListenerLayoutComponent } from './listener-layout/listener-layout.component';
  import { MusicPlayerComponent } from './music-player/music-player.component';
  import { MusicControllerComponent } from './music-player/music-controller/music-controller.component';
  import {MatIcon} from '@angular/material/icon';
  import {SharedModule} from '../shared/shared.module';
  import {
    ClickableFeaturedArtistsComponent
  } from '../shared/artist/clickable-featured-artists/clickable-featured-artists.component';
  import {MatAnchor, MatButton, MatFabAnchor, MatFabButton, MatIconButton} from '@angular/material/button';
  import {MatTooltip} from '@angular/material/tooltip';
  import {MatFormField, MatInput} from "@angular/material/input";
  import {MatSlider, MatSliderThumb} from '@angular/material/slider';
  import { ReleaseViewComponent } from './release-view/release-view.component';
  import {TracksModule} from '../artist/tracks/tracks.module';
  import { PlayTrackComponent } from './play-track/play-track.component';
  import {MatDivider} from '@angular/material/divider';
  import { UserSubscriptionComponent } from './user-subscription/user-subscription.component';
  import {
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
    MatTable
  } from '@angular/material/table';
  import {MatChipRow} from '@angular/material/chips';
  import {FormsModule, ReactiveFormsModule} from '@angular/forms';
  import {RouterModule} from '@angular/router';
  import {
    MatCard, MatCardActions,
    MatCardAvatar, MatCardContent, MatCardFooter,
    MatCardHeader,
    MatCardMdImage, MatCardSmImage,
    MatCardTitle,
    MatCardTitleGroup
  } from '@angular/material/card';
  import {MatTabLabel} from '@angular/material/tabs';
  import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
  import {MatSelect} from '@angular/material/select';
import { WebStoreComponent } from './web-store/store-home/store-home.component';
  import {StoreArtistPageComponent} from './web-store/store-artist-page/store-artist-page.component';
  import {ProductDetailsComponent} from '../artist/products/product-details/product-details.component';
import { ProductWishlistComponent } from './web-store/product-wishlist/product-wishlist.component';
import { StoreSearchComponent } from './web-store/store-search/store-search.component';
import { CheckoutComponent } from './web-store/checkout/checkout.component';
import { OrderConfirmationDialogComponent } from './web-store/checkout/order-confirmation-dialog/order-confirmation-dialog.component';
import { BytypeComponent } from './web-store/bytype/bytype.component';


  @NgModule({
    declarations: [
      ListenerLayoutComponent,
      MusicPlayerComponent,
      MusicControllerComponent,
      ReleaseViewComponent,
      PlayTrackComponent,
      UserSubscriptionComponent,
      WebStoreComponent,
      StoreArtistPageComponent,
      ProductDetailsComponent,
      ProductWishlistComponent,
      StoreSearchComponent,
      CheckoutComponent,
      OrderConfirmationDialogComponent,
      BytypeComponent
    ],
    imports: [
      CommonModule,
      ListenerRoutingModule,
      MatIcon,
      SharedModule,
      MatIconButton,
      MatTooltip,
      MatInput,
      MatFormField,
      MatButton,
      MatSlider,
      MatSliderThumb,
      TracksModule,
      MatDivider,
      MatTable,
      MatColumnDef,
      MatHeaderCell,
      MatCell,
      MatCellDef,
      MatHeaderCellDef,
      MatHeaderRow,
      MatHeaderRowDef,
      MatRowDef,
      MatChipRow,
      MatRow,
      NgOptimizedImage,
      MatButton,
      MatIcon,
      MatFabButton,
      MatFabAnchor,
      FormsModule,
      RouterModule,
      MatCard,
      MatCardHeader,
      MatCardTitle,
      MatCardAvatar,
      MatCardTitleGroup,
      MatCardMdImage,
      MatCardSmImage,
      MatCardActions,
      MatIconButton,
      MatAnchor,
      MatCardFooter,
      MatCardContent,
      ReactiveFormsModule,
      MatFormField,
      MatInput,
      SharedModule,
      MatTabLabel,
      MatAutocomplete,
      MatOption,
      MatSelect,
      MatAutocompleteTrigger,
      MatTooltip
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
  })
  export class ListenerModule { }
