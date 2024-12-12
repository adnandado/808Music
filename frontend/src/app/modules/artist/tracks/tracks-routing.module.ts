import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from '../../public/home/home.component';
import {BlogComponent} from '../../public/blog/blog.component';
import {TracksListComponent} from './tracks-list/tracks-list.component';
import {TracksLayoutComponent} from './tracks-layout/tracks-layout.component';

const routes: Routes = [
  {path: '', component: TracksLayoutComponent, children: [
    {path: ':id', component: TracksListComponent},
    ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TracksRoutingModule { }
