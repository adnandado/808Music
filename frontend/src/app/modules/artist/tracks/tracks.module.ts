import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TracksRoutingModule } from './tracks-routing.module';
import { TracksListComponent } from './tracks-list/tracks-list.component';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import { TracksLayoutComponent } from './tracks-layout/tracks-layout.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from "@angular/material/table";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    TracksListComponent,
    TracksLayoutComponent
  ],
    imports: [
        CommonModule,
        TracksRoutingModule,
        MatIcon,
        MatButton,
        MatIconButton,
        MatTable,
        MatColumnDef,
        MatHeaderCell,
        MatCell,
        MatHeaderCellDef,
        MatCellDef,
        MatHeaderRow,
        MatRow,
        MatRowDef,
        MatHeaderRowDef,
        SharedModule
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TracksModule { }
