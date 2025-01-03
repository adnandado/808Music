import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

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
