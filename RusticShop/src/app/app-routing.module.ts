import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { PasswordResetRequestComponent } from './auth/password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { RequestAccountUnlockComponent } from './auth/request-account-unlock/request-account-unlock.component';
import { UnlockAccountComponent } from './auth/unlock-account/unlock-account.component';

const routes: Routes = [
  { path: 'Users/auth/unlock-account', component: UnlockAccountComponent },
  { path: 'Users/auth/request-account-unlock', component: RequestAccountUnlockComponent },
  { path: 'Users/auth/request-password-reset', component: PasswordResetRequestComponent },
  { path: 'Users/auth/reset-password', component: PasswordResetComponent },
  { path: 'Users/auth/login', component: LoginComponent },
  { path: 'Users/auth/registration', component: RegistrationComponent },
  { path: '', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
