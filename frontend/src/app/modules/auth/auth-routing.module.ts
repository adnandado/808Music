import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {TwoFactorComponent} from './two-factor/two-factor.component';
import {AdminErrorPageComponent} from '../admin/admin-error-page/admin-error-page.component';
import {AuthLayoutComponent} from './auth-layout/auth-layout.component';
import {LogoutComponent} from './logout/logout.component';
import {ResetPasswordComponent} from './reset-password/reset-password.component';
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: 'login', component: LoginComponent},//half-done
      {path: 'logout', component: LogoutComponent},
      {path: 'forgot-password', component: ForgetPasswordComponent}, //done
      {path: 'two-factor', component: TwoFactorComponent},
      {path: 'reset-password', component: ResetPasswordComponent},
      {path: 'register', component: RegisterComponent},
      {path: '**', component: AdminErrorPageComponent}  // Default ruta koja vodi na public
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
