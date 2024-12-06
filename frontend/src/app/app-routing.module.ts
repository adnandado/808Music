import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UnauthorizedComponent} from './modules/shared/unauthorized/unauthorized.component';
import {AuthGuard} from './auth-guards/auth-guard.service';
import { ProductsCreateComponent } from './modules/artist/products/products-create/products-create.component';
import { ProductListComponent } from './modules/artist/products/product-list/product-list.component';
import {ArtistLayoutComponent} from './modules/artist/artist-layout/artist-layout.component';
const routes: Routes = [
  {path: 'unauthorized', component: UnauthorizedComponent},
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: {isAdmin: true}, // Proslijeđivanje potrebnih prava pristupa, ako je potrebno
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)  // Lazy load  modula
  },
  {
    path: 'artist',
    loadChildren: () => import('./modules/artist/artist.module').then(m => m.ArtistModule)
  },
  {
    path: 'product-create',
    component: ProductsCreateComponent
  },
  {
    path: 'product-list',
    component: ProductListComponent
  },
  {
    path: 'public',
    loadChildren: () => import('./modules/public/public.module').then(m => m.PublicModule)  // Lazy load  modula
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)  // Lazy load  modula
  },
  {path: '**', redirectTo: 'public', pathMatch: 'full'}  // Default ruta koja vodi na public
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
