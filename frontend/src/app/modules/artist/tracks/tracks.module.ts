import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TracksRoutingModule } from './tracks-routing.module';
import { TracksListComponent } from './tracks-list/tracks-list.component';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
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
import { TracksCreateOrEditComponent } from './tracks-create-or-edit/tracks-create-or-edit.component';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatFormField, MatSuffix} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {NgxAudioPlayerModule} from '@khajegan/ngx-audio-player';
import {MatAutocomplete, MatAutocompleteTrigger} from "@angular/material/autocomplete";
import {AppModule} from "../../../app.module";


@NgModule({
  declarations: [
    TracksListComponent,
    TracksLayoutComponent,
    TracksCreateOrEditComponent
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
        SharedModule,
        MatAnchor,
        MatDatepicker,
        MatDatepickerInput,
        MatDatepickerToggle,
        MatFormField,
        MatInput,
        MatOption,
        MatSelect,
        MatSuffix,
        MatSlideToggle,
        NgxAudioPlayerModule,
        MatAutocomplete,
        MatAutocompleteTrigger,
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TracksModule { }
