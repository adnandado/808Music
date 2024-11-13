import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PublicRoutingModule} from './public-routing.module';
import {AboutComponent} from './about/about.component';
import {BlogComponent} from './blog/blog.component';
import {ContactUsComponent} from './contact-us/contact-us.component';
import {HomeComponent} from './home/home.component';
import {PublicLayoutComponent} from './public-layout/public-layout.component';
import {TravelsComponent} from './travels/travels.component';
import {FormsModule} from '@angular/forms';
import { AlbumCreateComponent } from '../artist/album/album-create/album-create.component';
import {MatButton} from '@angular/material/button';

@NgModule({
  declarations: [
    AboutComponent,
    BlogComponent,
    ContactUsComponent,
    HomeComponent,
    PublicLayoutComponent,
    TravelsComponent,
    AlbumCreateComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    MatButton
  ],

})
export class PublicModule {
}
