import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from '../../app.component';
import {ListenerLayoutComponent} from './listener-layout/listener-layout.component';
import {NewHomeComponent} from '../public/new-home/new-home.component';
import {ReleaseViewComponent} from './release-view/release-view.component';
import {PlayTrackComponent} from './play-track/play-track.component';
import {
  SubscriptionDetailsService
} from '../../endpoints/subscription-endpoints/get-subscription-details-endpoint.service';
import {UserSubscriptionComponent} from './user-subscription/user-subscription.component';
import {PlaylistListMaterialComponent} from '../artist/playlist/playlist-list/playlist-list-material.component';
import {PlaylistCreateOrEditComponent} from '../artist/playlist/playlist-create/playlist-create-or-edit.component';
import {TracksPageComponent} from '../artist/playlist/tracks-page/tracks-page.component';

const routes: Routes = [{
  path: '', component: ListenerLayoutComponent,
  children: [
    {
      path: 'home', component: NewHomeComponent,
    },
    {
      path: 'release/:id', component: ReleaseViewComponent,
    },
    {
      path: 'track/:id', component: PlayTrackComponent

    },
    {
      path: 'playlist',
      loadChildren: () => import("../artist/playlist/playlist.module").then(m => m.PlaylistModule)
    },

  ]},




  {
  path: 'subscriptions',
  component: UserSubscriptionComponent,
},
  {
    path: 'playlist',
    component: PlaylistListMaterialComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListenerRoutingModule { }
