import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AlbumListComponent} from './album-list/album-list.component';
import {AlbumCreateComponent} from '../../public/album/album-create/album-create.component';
import {UnauthorizedComponent} from '../../shared/unauthorized/unauthorized.component';
import {AlbumListMaterialComponent} from './album-list-material/album-list-material.component';

const routes: Routes = [
  {
    path: '',
    component: AlbumListComponent,
    children: [
      {
        path: 'create', component: AlbumCreateComponent
      },
      {
        path: 'edit', component: AlbumListMaterialComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlbumRoutingModule { }
