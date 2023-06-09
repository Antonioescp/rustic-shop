import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Product } from '../shared/models/Product';
import { Pagination } from './categories.service';
import { CrudService } from '../shared/others/CrudService';
import { PaginatedResponse } from '../shared/models/dtos/PaginatedResponse';
import Category from '../shared/models/Category';
import Attribute from '../shared/models/Attribute';
import { ProductWithBrandName } from '../shared/models/dtos/products/ProductWithBrandName';

@Injectable({
  providedIn: 'root',
})
export class ProductsService implements CrudService<Product> {
  readonly productsUrl = `${environment.apiBaseUrl}${environment.productsEndpoint}`;

  constructor(private http: HttpClient) {}

  private getProductCategoriesUrl(id: number): string {
    return `${this.productsUrl}${id}/categories/`;
  }

  private getProductAttributesUrl(id: number): string {
    return `${this.productsUrl}${id}/attributes/`;
  }

  getAllWithBrandName(): Observable<ProductWithBrandName[]> {
    return this.http.get<ProductWithBrandName[]>(
      this.productsUrl + 'with-brand-name'
    );
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl + 'all');
  }

  getPaginated(pagination: Pagination): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams()
      .set('pageIndex', pagination.pageIndex)
      .set('pageSize', pagination.pageSize)
      .set(
        'sortColumn',
        pagination.sort ? pagination.sort.active : pagination.defaultSortColumn
      )
      .set(
        'sortOrder',
        pagination.sort
          ? pagination.sort.direction
          : pagination.defaultSortOrder
      );

    if (pagination.filterQuery) {
      params = params
        .set('filterColumn', pagination.defaultFilterColumn)
        .set('filterQuery', pagination.filterQuery);
    }
    return this.http.get<any>(this.productsUrl, { params });
  }

  getById(id: number): Observable<Product> {
    const url = `${this.productsUrl}${id}`;
    return this.http.get<Product>(url);
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

  create(product: Omit<Product, 'id'>): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.productsUrl, product);
  }

  deleteById(id: number): Observable<HttpResponse<any>> {
    const targetUrl = `${this.productsUrl}${id}`;
    return this.http.delete<any>(targetUrl, { observe: 'response' });
  }

  update(product: Product): Observable<HttpResponse<any>> {
    const url = `${this.productsUrl}${product.id}`;
    return this.http.put<any>(url, product);
  }
}
