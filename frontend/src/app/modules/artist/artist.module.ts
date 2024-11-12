import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    MatRow
  ]
})
export class ArtistModule { }
