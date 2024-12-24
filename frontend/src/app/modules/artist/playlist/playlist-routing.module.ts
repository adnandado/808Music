import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlaylistListMaterialComponent} from './playlist-list/playlist-list-material.component';
import {PlaylistCreateOrEditComponent} from './playlist-create/playlist-create-or-edit.component';
import {TracksPageComponent} from './tracks-page/tracks-page.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistListMaterialComponent,
    children: [
      { path: 'create', component: PlaylistCreateOrEditComponent },
      { path: 'edit/:id', component: PlaylistCreateOrEditComponent },

    ],

  },
  { path: ':id', component: TracksPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaylistRoutingModule {}
