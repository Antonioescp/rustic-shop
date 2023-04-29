import { Injectable } from '@angular/core';
import VProductSummary from './shared/models/VProductSummary';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Product } from './shared/models/Product';
import ProductAddFeatureRequest from './shared/models/ProductAddFeatureRequest';
import ProductAddCategoryRequest from './shared/models/ProductAddCategory';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  readonly url = `${environment.apiBaseUrl}${environment.productsEndpoint}`;

  constructor(
    private http: HttpClient
  ) {}

  getProductListView(): Observable<VProductSummary[]> {
    const url = `${environment.apiBaseUrl}${environment.productListViewEndpoint}`;
    return this.http.get<VProductSummary[]>(url);
  }

  addProduct(product: Omit<Product, 'id'>): Observable<HttpResponse<any>> {
    return this.http.post<HttpResponse<any>>(this.url, product, { observe: 'response' });
  }

  addFeature(data: ProductAddFeatureRequest): Observable<HttpResponse<any>> {
    const url = `${this.url}${data.productId}/features/${data.featureId}`;
    return this.http.post<HttpResponse<any>>(url, { content: data.content }, { observe: 'response' });
  }

  addCategory(data: ProductAddCategoryRequest): Observable<HttpResponse<any>> {
    const url = `${this.url}${data.productId}/categories/${data.categoryId}`;
    return this.http.post<HttpResponse<any>>(url, { observe: 'response' });
  }
}
