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

import { AuthInterceptor } from './http-interceptors/AuthInterceptor';
import { ProductCardComponent } from './product-card/product-card.component';
import { CategoriesComponent } from './admin/categories/categories/categories.component';
import { AttributesComponent } from './admin/attributes/attributes/attributes.component';
import { DiscountsComponent } from './admin/discounts/discounts/discounts.component';
import { ProductsComponent } from './admin/products/products/products.component';
import { BrandsComponent } from './admin/brands/brands/brands.component';
import { BrandEditDialogComponent } from './admin/brands/brand-edit-dialog/brand-edit-dialog.component';
import { CategoryEditDialogComponent } from './admin/categories/category-edit-dialog/category-edit-dialog.component';
import { AttributeEditDialogComponent } from './admin/attributes/attribute-edit-dialog/attribute-edit-dialog.component';
import { DiscountEditDialogComponent } from './admin/discounts/discount-edit-dialog/discount-edit-dialog.component';
import { ProductEditDialogComponent } from './admin/products/product-edit-dialog/product-edit-dialog.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { ProductEditSchemaDialogComponent } from './admin/products/product-edit-schema-dialog/product-edit-schema-dialog.component';
import { ProductVariantsComponent } from './admin/product-variants/product-variants/product-variants.component';
import { ProductVariantEditDialogComponent } from './admin/product-variants/product-variant-edit-dialog/product-variant-edit-dialog.component';
import { MainComponent } from './main/main.component';
import { TableComponent } from './shared/components/table/table.component';
import { SalesTableComponent } from './admin/sales-table/sales-table.component';
import { ProductGalleryDialogComponent } from './admin/products/product-gallery-dialog/product-gallery-dialog.component';
import { ImageGalleryComponent } from './shared/components/image-gallery/image-gallery.component';
import { ProductVariantGalleryDialogComponent } from './admin/product-variants/product-variant-gallery-dialog/product-variant-gallery-dialog.component';
import { ProductVariantEditSchemaDialogComponent } from './admin/product-variants/product-variant-edit-schema-dialog/product-variant-edit-schema-dialog.component';
import { ProductVariantDiscountManagementDialogComponent } from './admin/product-variants/product-variant-discount-management-dialog/product-variant-discount-management-dialog.component';

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
    ProductCardComponent,
    CategoriesComponent,
    AttributesComponent,
    DiscountsComponent,
    ProductsComponent,
    BrandsComponent,
    BrandEditDialogComponent,
    CategoryEditDialogComponent,
    AttributeEditDialogComponent,
    DiscountEditDialogComponent,
    ProductEditDialogComponent,
    ConfirmDialogComponent,
    ProductEditSchemaDialogComponent,
    ProductVariantsComponent,
    ProductVariantEditDialogComponent,
    MainComponent,
    TableComponent,
    SalesTableComponent,
    ProductGalleryDialogComponent,
    ImageGalleryComponent,
    ProductVariantGalleryDialogComponent,
    ProductVariantEditSchemaDialogComponent,
    ProductVariantDiscountManagementDialogComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
