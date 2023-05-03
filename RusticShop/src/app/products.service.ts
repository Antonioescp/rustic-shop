import { Injectable } from '@angular/core';
import VProductSummary from './shared/models/VProductSummary';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Product } from './shared/models/Product';
import ProductAddFeatureRequest from './shared/models/ProductAddFeatureRequest';
import ProductAddCategoryRequest from './shared/models/ProductAddCategory';
import { Pagination } from './categories.service';
import ProductFeature from './shared/dtos/Product/product-feature';
import Category from './shared/models/Category';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  readonly productsUrl = `${environment.apiBaseUrl}${environment.productsEndpoint}`;

  constructor(private http: HttpClient) {}

  getProductListView(): Observable<VProductSummary[]> {
    const url = `${environment.apiBaseUrl}${environment.productListViewEndpoint}`;
    return this.http.get<VProductSummary[]>(url);
  }

  getPaginatedProducts(pagination: Pagination): Observable<any> {
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

  getProduct(id: number): Observable<Product> {
    const url = `${this.productsUrl}${id}`;
    return this.http.get<Product>(url);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(this.productsUrl, product, {
      observe: 'response',
    });
  }

  deleteProduct(id: number): Observable<HttpResponse<any>> {
    const targetUrl = `${this.productsUrl}${id}`;
    return this.http.delete<any>(targetUrl, { observe: 'response' });
  }

  updateProduct(product: Product): Observable<HttpResponse<any>> {
    const url = `${this.productsUrl}${product.id}`;
    return this.http.put(url, product, { observe: 'response' });
  }

  getProductFeatures(id: number): Observable<ProductFeature[]> {
    const url = `${this.productsUrl}${id}/features`;
    return this.http.get<ProductFeature[]>(url);
  }

  addFeatureToProduct(
    data: ProductAddFeatureRequest
  ): Observable<HttpResponse<any>> {
    const url = `${this.productsUrl}${data.productId}/features/${data.featureId}`;
    return this.http.post<HttpResponse<any>>(
      url,
      { content: data.content },
      { observe: 'response' }
    );
  }

  deleteProductFeature(
    id: number,
    featureId: number
  ): Observable<HttpResponse<any>> {
    const url = `${this.productsUrl}${id}/features/${featureId}`;
    return this.http.delete<any>(url, { observe: 'response' });
  }

  getProductCategories(id: number): Observable<Category[]> {
    const url = `${this.productsUrl}${id}/categories`;
    return this.http.get<Category[]>(url);
  }

  addCategoryToProduct(
    data: ProductAddCategoryRequest
  ): Observable<HttpResponse<any>> {
    const url = `${this.productsUrl}${data.productId}/categories/${data.categoryId}`;
    return this.http.post<any>(url, null, { observe: 'response' });
  }

  deleteProductCategory(
    id: number,
    categoryId: number
  ): Observable<HttpResponse<any>> {
    const url = `${this.productsUrl}${id}/categories/${categoryId}`;
    return this.http.delete<any>(url, { observe: 'response' });
  }
}
