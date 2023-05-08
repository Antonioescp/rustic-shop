import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Product } from './shared/models/Product';
import { Pagination } from './categories.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  readonly productsUrl = `${environment.apiBaseUrl}${environment.productsEndpoint}`;

  constructor(private http: HttpClient) {}

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
}
