import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/modules/material/material.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { NavComponent } from './nav/nav.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { PasswordResetRequestComponent } from './auth/password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { RequestAccountUnlockComponent } from './auth/request-account-unlock/request-account-unlock.component';
import { UnlockAccountComponent } from './auth/unlock-account/unlock-account.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { AdminProductListComponent } from './admin/admin-product-list/admin-product-list.component';

import { AuthService } from './auth.service';
import { AuthInterceptor } from './http-interceptors/AuthInterceptor';
import { ProductsService } from './products.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavComponent,
    RegistrationComponent,
    PasswordResetRequestComponent,
    PasswordResetComponent,
    RequestAccountUnlockComponent,
    UnlockAccountComponent,
    AdminPanelComponent,
    AdminProductListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { provide: AuthService },
    { provide: ProductsService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
