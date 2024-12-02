import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {ForgetPasswordComponent} from './forget-password/forget-password.component';
import {TwoFactorComponent} from './two-factor/two-factor.component';
import {FormsModule} from '@angular/forms';
import { LogoutComponent } from './logout/logout.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from '@angular/material/input';
import {MatHeaderRow} from '@angular/material/table';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatCard, MatCardContent} from "@angular/material/card";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { PassStrengthMeterComponent } from './pass-strength-meter/pass-strength-meter.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    TwoFactorComponent,
    LogoutComponent,
    AuthLayoutComponent,
    ResetPasswordComponent,
    PassStrengthMeterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatHeaderRow,
    MatCheckbox,
    MatCard,
    MatCardContent
  ]
})
export class AuthModule {
}
