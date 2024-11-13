import { NgModule } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';

import { ArtistRoutingModule } from './artist-routing.module';
import { AlbumListComponent } from './album/album-list/album-list.component';
import { ChooseProfileComponent } from './choose-profile/choose-profile.component';
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
import {MatButton, MatFabAnchor, MatFabButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';


@NgModule({
  declarations: [
    AlbumListComponent,
    ChooseProfileComponent
  ],
  imports: [
    CommonModule,
    ArtistRoutingModule,
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
    MatFabAnchor
  ]
})
export class ArtistModule { }
