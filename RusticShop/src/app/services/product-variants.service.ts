import { Injectable } from '@angular/core';
import { ProductVariant } from '../shared/models/ProductVariant';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseCrudService } from '../shared/services/BaseCrudService';
import { Pagination } from './categories.service';
import { ProductImage } from '../shared/models/ProductImage';
import { ProductVariantAttributeDto } from '../shared/models/dtos/product-variants/ProductVariantAttributeDto';
import { ProductVariantAttribute } from '../shared/models/ProductVariantAttribute';

@Injectable({
  providedIn: 'root',
})
export class ProductVariantsService extends BaseCrudService<ProductVariant> {
  constructor(http: HttpClient) {
    const productVariantsUrl = `${environment.apiBaseUrl}${environment.variantsEndpoint}`;
    super(productVariantsUrl, http);
  }

  getPaginatedListItem(pagination: Pagination): Observable<any> {
    const params = pagination.toHttpParams();
    return this.http.get<any>(this.resourceUrl + 'details', { params });
  }

  isSkuAvailable(sku: string): Observable<boolean> {
    const url = this.resourceUrl + 'sku-availability';
    return this.http.post<boolean>(url, { sku });
  }

  addImage(variantId: number, imageId: number): Observable<any> {
    const url = `${this.resourceUrl}${variantId}/images/${imageId}`;
    return this.http.post<any>(url, {});
  }

  removeImage(variantId: number, imageId: number): Observable<any> {
    const url = `${this.resourceUrl}${variantId}/images/${imageId}`;
    return this.http.delete<any>(url);
  }

  getVariantImagesById(variantId: number): Observable<ProductImage[]> {
    const url = `${this.resourceUrl}${variantId}/images`;
    return this.http.get<ProductImage[]>(url);
  }

  getAttributes(variantId: number): Observable<ProductVariantAttributeDto[]> {
    const url = `${this.resourceUrl}${variantId}/attributes`;
    return this.http.get<ProductVariantAttributeDto[]>(url);
  }

  addAttribute(
    variantId: number,
    attribute: Pick<ProductVariantAttribute, 'attributeId' | 'value'>
  ): Observable<any> {
    const url = `${this.resourceUrl}${variantId}/attributes`;
    return this.http.post<any>(url, attribute);
  }

  deleteAttribute(variantId: number, attributeId: number): Observable<any> {
    const url = `${this.resourceUrl}${variantId}/attributes/${attributeId}`;
    return this.http.delete<any>(url);
  }
}
