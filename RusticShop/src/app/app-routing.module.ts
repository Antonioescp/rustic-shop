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
import { CategoryEditComponent } from './admin/categories/category-edit/category-edit.component';
import { FeaturesComponent } from './admin/features/features/features.component';
import { FeatureEditComponent } from './admin/features/feature-edit/feature-edit.component';
import { DiscountsComponent } from './admin/discounts/discounts/discounts.component';
import { DiscountEditComponent } from './admin/discounts/discount-edit/discount-edit.component';
import { ProductsComponent } from './admin/products/products/products.component';
import { ProductEditComponent } from './admin/products/product-edit/product-edit.component';

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
      { path: 'categoria', component: CategoryEditComponent },
      { path: 'categoria/:id', component: CategoryEditComponent },
      { path: 'caracteristicas', component: FeaturesComponent },
      { path: 'caracteristica', component: FeatureEditComponent },
      { path: 'caracteristica/:id', component: FeatureEditComponent },
      { path: 'descuentos', component: DiscountsComponent },
      { path: 'descuento', component: DiscountEditComponent },
      { path: 'descuento/:id', component: DiscountEditComponent },
    ],
  },
  { path: '', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
