import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from '../../app.component';
import {ListenerLayoutComponent} from './listener-layout/listener-layout.component';
import {NewHomeComponent} from '../public/new-home/new-home.component';
import {ReleaseViewComponent} from './release-view/release-view.component';
import {PlayTrackComponent} from './play-track/play-track.component';
import {
  SubscriptionDetailsService
} from '../../endpoints/subscription-endpoints/get-subscription-details-endpoint.service';
import {UserSubscriptionComponent} from './user-subscription/user-subscription.component';
import {PlaylistListMaterialComponent} from '../artist/playlist/playlist-list/playlist-list-material.component';
import {PlaylistCreateOrEditComponent} from '../artist/playlist/playlist-create/playlist-create-or-edit.component';
import {TracksPageComponent} from '../artist/playlist/tracks-page/tracks-page.component';
import {WebStoreComponent} from './web-store/store-home/store-home.component';
import {ProductListComponent} from '../artist/products/product-list/product-list.component';
import {ProductDetailsComponent} from '../artist/products/product-details/product-details.component';
import {ProductWishlistComponent} from './web-store/product-wishlist/product-wishlist.component';
import {StoreSearchComponent} from './web-store/store-search/store-search.component';
import {CheckoutComponent} from './web-store/checkout/checkout.component';
import {BytypeComponent} from './web-store/bytype/bytype.component';

const routes: Routes = [{
  path: '', component: ListenerLayoutComponent,
  children: [
    {
      path: 'home', component: NewHomeComponent,
    },
    {
      path: 'release/:id', component: ReleaseViewComponent,
    },
    {
      path: 'track/:id', component: PlayTrackComponent

    },
    {
      path: 'playlist',
      loadChildren: () => import("../artist/playlist/playlist.module").then(m => m.PlaylistModule)
    },
    {path: 'store-home',
      component: WebStoreComponent
    },
    {path: 'product/:slug',
      component: ProductDetailsComponent
    },
    {path: 'product-wishlist',
      component: ProductWishlistComponent
    },
    { path: 'product-search', component: StoreSearchComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'product-type', component: BytypeComponent },
  ]},



  {
  path: 'subscriptions',
  component: UserSubscriptionComponent,
},
  {
    path: 'playlist',
    component: PlaylistListMaterialComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListenerRoutingModule { }
