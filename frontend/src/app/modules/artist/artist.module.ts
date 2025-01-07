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
import {MatAnchor, MatButton, MatFabAnchor, MatFabButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import { ProductsCreateComponent } from './products/products-create/products-create.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ArtistLayoutComponent } from './artist-layout/artist-layout.component';
import {
  MatCard, MatCardActions,
  MatCardAvatar, MatCardContent, MatCardFooter,
  MatCardHeader,
  MatCardMdImage, MatCardSmImage,
  MatCardTitle,
  MatCardTitleGroup
} from '@angular/material/card';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ArtistCreateOrEditComponent } from './artist-create-or-edit/artist-create-or-edit.component';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {SharedModule} from '../shared/shared.module';
import {MatTabLabel} from '@angular/material/tabs';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatSelect} from "@angular/material/select";
import {MatTooltip} from "@angular/material/tooltip";
import { JoinArtistProfileComponent } from './join-artist-profile/join-artist-profile.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import {NgxImageZoomModule} from 'ngx-image-zoom';

@NgModule({
  declarations: [
    AlbumListComponent,
    ChooseProfileComponent,
    ProductsCreateComponent,
    ProductListComponent,
    ArtistLayoutComponent,
    ArtistCreateOrEditComponent,
    ManageUsersComponent,
    JoinArtistProfileComponent,
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
    MatFabAnchor,
    FormsModule,
    RouterModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardAvatar,
    MatCardTitleGroup,
    MatCardMdImage,
    MatCardSmImage,
    MatCardActions,
    MatIconButton,
    MatAnchor,
    MatCardFooter,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    SharedModule,
    MatTabLabel,
    MatAutocomplete,
    MatOption,
    MatSelect,
    MatAutocompleteTrigger,
    MatTooltip,
    NgxImageZoomModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ArtistModule { }
