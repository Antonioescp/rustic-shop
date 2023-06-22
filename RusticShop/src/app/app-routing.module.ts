import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { BrandsComponent } from './admin/brands/brands/brands.component';
import { ProductVariantsComponent } from './admin/product-variants/product-variants/product-variants.component';
import { MainComponent } from './main/main.component';
import {
  canActivateAuthRoutes,
  canActivateAdminRoutes,
  canActivateProgrammerRoutes,
  canActivateEmployeeRoutes,
} from './guards/auth.guard';
import { SalesTableComponent } from './admin/sales-table/sales-table.component';

const routes: Routes = [
  {
    path: 'Users',
    children: [
      {
        path: 'auth',
        canActivate: [canActivateAuthRoutes],
        children: [
          {
            path: 'unlock-account',
            component: UnlockAccountComponent,
          },
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
    path: 'admin',
    component: MainComponent,
    children: [
      {
        path: 'panel',
        canActivate: [canActivateEmployeeRoutes],
        component: AdminPanelComponent,
        children: [
          {
            path: 'productos',
            canActivate: [canActivateAdminRoutes],
            component: ProductsComponent,
          },
          {
            path: 'categorias',
            canActivate: [canActivateAdminRoutes],
            component: CategoriesComponent,
          },
          {
            path: 'caracteristicas',
            canActivate: [canActivateAdminRoutes],
            component: AttributesComponent,
          },
          {
            path: 'descuentos',
            canActivate: [canActivateAdminRoutes],
            component: DiscountsComponent,
          },
          {
            path: 'marcas',
            canActivate: [canActivateAdminRoutes],
            component: BrandsComponent,
          },
          { path: 'variantes', component: ProductVariantsComponent },
          { path: 'ordenes', component: SalesTableComponent },
        ],
      },
    ],
  },
  {
    path: 'home',
    component: MainComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
