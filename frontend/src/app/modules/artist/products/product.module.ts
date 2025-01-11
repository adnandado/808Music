import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {SharedModule} from '../../shared/shared.module';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatAnchor, MatButton, MatIconAnchor, MatIconButton} from '@angular/material/button';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle, MatCardTitleGroup} from '@angular/material/card';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';


@NgModule({
    declarations: [],
    exports: [

    ],
    imports: [
        CommonModule,
        ProductRoutingModule,
        MatFormField,
        MatSlideToggle,
        SharedModule,
        MatIcon,
        MatInput,
        MatButton,
        MatAnchor,
        MatCardHeader,
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatCardTitleGroup,
        MatFormFieldModule,
        MatIconAnchor,
        MatIconButton,
        MatAutocomplete,
        MatOption,
        MatAutocompleteTrigger,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem
    ]
})
export class ProductModule { }
