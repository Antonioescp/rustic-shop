import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { PasswordResetRequestComponent } from './auth/password-reset-request/password-reset-request.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { RequestAccountUnlockComponent } from './auth/request-account-unlock/request-account-unlock.component';
import { UnlockAccountComponent } from './auth/unlock-account/unlock-account.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { CategoriesComponent } from './admin/categories/categories/categories.component';
import { AttributesComponent } from './admin/attributes/attributes/attributes.component';
import { DiscountsComponent } from './admin/discounts/discounts/discounts.component';
import { ProductsComponent } from './admin/products/products/products.component';
import { ProductEditComponent } from './admin/products/product-edit/product-edit.component';
import { BrandsComponent } from './admin/brands/brands/brands.component';

const routes: Routes = [
  {
    path: 'Users',
    children: [
      {
        path: 'auth',
        children: [
          { path: 'unlock-account', component: UnlockAccountComponent },
          {
            path: 'request-account-unlock',
            component: RequestAccountUnlockComponent,
          },
          {
            path: 'request-password-reset',
            component: PasswordResetRequestComponent,
          },
          { path: 'reset-password', component: PasswordResetComponent },
          { path: 'login', component: LoginComponent },
          { path: 'registration', component: RegistrationComponent },
        ],
      },
    ],
  },
  {
    path: 'admin/panel',
    component: AdminPanelComponent,
    children: [
      { path: 'productos', component: ProductsComponent },
      { path: 'producto', component: ProductEditComponent },
      { path: 'producto/:id', component: ProductEditComponent },
      { path: 'categorias', component: CategoriesComponent },
      { path: 'caracteristicas', component: AttributesComponent },
      { path: 'descuentos', component: DiscountsComponent },
      { path: 'marcas', component: BrandsComponent },
    ],
  },
  { path: '', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
