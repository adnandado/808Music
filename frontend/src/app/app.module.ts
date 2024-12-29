import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {MyAuthInterceptor} from './services/auth-services/my-auth-interceptor.service';
import {MyAuthService} from './services/auth-services/my-auth.service';
import {SharedModule} from './modules/shared/shared.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {FormsModule} from '@angular/forms';
import {MAT_DATE_LOCALE, provideNativeDateAdapter} from '@angular/material/core';
import {MyErrorInterceptorService} from './services/my-error-interceptor.service';
import {RouterModule} from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {MyImgCompressInterceptorService} from './services/my-img-compress-interceptor.service';
import { SecondsToDurationStringPipe } from './services/pipes/seconds-to-string.pipe';
import { LongDurationStringPipe } from './services/pipes/long-duration-string.pipe';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {CustomTranslateLoader} from './services/translate-loader';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule, // Omogućava korištenje UnauthorizedComponent u AppRoutingModule
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new CustomTranslateLoader(http),
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyAuthInterceptor,
      multi: true // Ensures multiple interceptors can be used if needed
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyErrorInterceptorService,
      multi: true // Ensures multiple interceptors can be used if needed
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyImgCompressInterceptorService,
      multi: true // Ensures multiple interceptors can be used if needed
    },
    provideNativeDateAdapter(),
    MyAuthService,
    provideAnimationsAsync() // Ensure MyAuthService is available for the interceptor
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
