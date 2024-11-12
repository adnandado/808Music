import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../public/home/home.component';
import {AdminLayoutComponent} from '../admin/admin-layout/admin-layout.component';
import {AlbumCreateComponent} from '../public/album/album-create/album-create.component';
import {AlbumListComponent} from './album/album-list/album-list.component';
import {UnauthorizedComponent} from '../shared/unauthorized/unauthorized.component';
import {ChooseProfileComponent} from './choose-profile/choose-profile.component';

const routes: Routes = [
  {
    path: '',
    component: ChooseProfileComponent,
    children: [
      {
        path: 'album',
        loadChildren: () => import("./album/album.module").then(m => m.AlbumModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistRoutingModule { }
