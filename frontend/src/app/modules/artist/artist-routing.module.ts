import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../public/home/home.component';
import {AdminLayoutComponent} from '../admin/admin-layout/admin-layout.component';
import {AlbumCreateComponent} from './album/album-create/album-create.component';
import {AlbumListComponent} from './album/album-list/album-list.component';
import {UnauthorizedComponent} from '../shared/unauthorized/unauthorized.component';
import {ChooseProfileComponent} from './choose-profile/choose-profile.component';
import {ArtistLayoutComponent} from './artist-layout/artist-layout.component';
import {AlbumListMaterialComponent} from './album/album-list-material/album-list-material.component';
import {ArtistCreateOrEditComponent} from './artist-create-or-edit/artist-create-or-edit.component';
import {ManageUsersComponent} from './manage-users/manage-users.component';
import {JoinArtistProfileComponent} from './join-artist-profile/join-artist-profile.component';
import {ProductsCreateComponent} from './products/products-create/products-create.component';
import {ProductListComponent} from './products/product-list/product-list.component';
import {ArtistHandlerService} from '../../services/artist-handler.service';
import {ProductAddEndpointService} from '../../endpoints/products-endpoints/product-create-endpoint.service';


const routes: Routes = [
  {
    path: '',
    component: ArtistLayoutComponent,
    children: [
      {
        path: 'album',
        loadChildren: () => import("./album/album.module").then(m => m.AlbumModule)
      },
      {
        path: 'tracks',
        loadChildren: () => import("./tracks/tracks.module").then(m => m.TracksModule)
      }
    ]
  },
  {
    path: 'create',
    component: AlbumCreateComponent
  },
  {
    path: 'product-create',
    component: ProductsCreateComponent
  },

  {
    path: ':artistName/products',
    component: ProductListComponent
  },
  {
    path: 'edit/:id',
    component: AlbumCreateComponent
  },
  {
    path: 'new-profile',
    component: ManageUsersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistRoutingModule { }
