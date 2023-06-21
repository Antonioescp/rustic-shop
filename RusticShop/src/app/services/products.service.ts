import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/Product';
import Category from '../shared/models/Category';
import Attribute from '../shared/models/Attribute';
import { ProductWithBrandName } from '../shared/models/dtos/products/ProductWithBrandName';
import { BaseCrudService } from '../shared/services/BaseCrudService';
import { ProductImage } from '../shared/models/ProductImage';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends BaseCrudService<Product> {
  constructor(http: HttpClient) {
    const productsUrl = `${environment.apiBaseUrl}${environment.productsEndpoint}`;
    super(productsUrl, http);
  }

  private getProductCategoriesUrl(id: number): string {
    return `${this.resourceUrl}${id}/categories/`;
  }

  private getProductAttributesUrl(id: number): string {
    return `${this.resourceUrl}${id}/attributes/`;
  }

  getAllWithBrandName(): Observable<ProductWithBrandName[]> {
    return this.http.get<ProductWithBrandName[]>(
      this.resourceUrl + 'with-brand-name'
    );
  }

  getCategories(productId: number): Observable<Category[]> {
    return this.http.get<Category[]>(this.getProductCategoriesUrl(productId));
  }

  addCategory(
    productId: number,
    categoryId: number
  ): Observable<HttpResponse<any>> {
    return this.http.post<any>(
      this.getProductCategoriesUrl(productId) + categoryId,
      null
    );
  }

  removeCategory(
    productId: number,
    categoryId: number
  ): Observable<HttpResponse<any>> {
    return this.http.delete<any>(
      this.getProductCategoriesUrl(productId) + categoryId
    );
  }

  getAttributes(productId: number): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(this.getProductAttributesUrl(productId));
  }

  addAttribute(productId: number, attributeId: number): Observable<any> {
    return this.http.post<any>(
      this.getProductAttributesUrl(productId) + attributeId,
      null
    );
  }

  removeAttribute(productId: number, attributeId: number): Observable<any> {
    return this.http.delete<any>(
      this.getProductAttributesUrl(productId) + attributeId
    );
  }

  getImagesByProductId(productId: number): Observable<ProductImage[]> {
    return this.http.get<ProductImage[]>(
      this.resourceUrl + productId + '/images'
    );
  }

  uploadImages(productId: number, images: File[]): Observable<any> {
    const url = `${environment.apiBaseUrl}${environment.productsEndpoint}${productId}/images`;
    const formData = new FormData();
    images.forEach(image => {
      formData.append('images', image);
    });
    return this.http.post<any>(url, formData);
  }

  deleteImage(productId: number, imageId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}${environment.productsEndpoint}${productId}/images/${imageId}`;
    return this.http.delete<any>(url);
  }
}
