import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../../public/home/home.component';
import {BlogComponent} from '../../public/blog/blog.component';
import {TracksListComponent} from './tracks-list/tracks-list.component';
import {TracksLayoutComponent} from './tracks-layout/tracks-layout.component';
import {TracksCreateOrEditComponent} from './tracks-create-or-edit/tracks-create-or-edit.component';

const routes: Routes = [
  {path: '', component: TracksLayoutComponent, children: [
    {path: ':id', component: TracksListComponent, children: [
        {path: 'edit/:id', component: TracksCreateOrEditComponent, data: {albumId: 1}},
        {path: 'create', component: TracksCreateOrEditComponent, data: {albumId: 1}}
      ]},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TracksRoutingModule { }
