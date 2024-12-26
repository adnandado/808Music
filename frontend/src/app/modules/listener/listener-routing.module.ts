import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from '../../app.component';
import {ListenerLayoutComponent} from './listener-layout/listener-layout.component';
import {NewHomeComponent} from '../public/new-home/new-home.component';
import {ReleaseViewComponent} from './release-view/release-view.component';
import {PlayTrackComponent} from './play-track/play-track.component';
import {ArtistPageComponent} from './artist-page/artist-page.component';
import {ArtistAlbumsListComponent} from './artist-albums-list/artist-albums-list.component';

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
      path: 'profile/:id', component: ArtistPageComponent
    },
    {
      path: 'releases/:id', component: ArtistAlbumsListComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListenerRoutingModule { }
