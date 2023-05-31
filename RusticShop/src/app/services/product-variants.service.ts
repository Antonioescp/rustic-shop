import { Injectable } from '@angular/core';
import { CrudService } from '../shared/others/CrudService';
import { ProductVariant } from '../shared/models/ProductVariant';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../shared/models/dtos/PaginatedResponse';
import { Pagination } from './categories.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductVariantsService implements CrudService<ProductVariant> {
  readonly baseUrl = `${environment.apiBaseUrl}${environment.variantsEndpoint}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductVariant[]> {
    return this.http.get<ProductVariant[]>(this.baseUrl + 'all');
  }

  getPaginated(
    pagination: Pagination
  ): Observable<PaginatedResponse<ProductVariant>> {
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
    return this.http.get<any>(this.baseUrl + 'details', { params });
  }

  getById(id: number): Observable<ProductVariant> {
    return this.http.get<ProductVariant>(this.baseUrl + id);
  }

  create(data: Partial<ProductVariant>): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.baseUrl, data);
  }

  update(data: Partial<ProductVariant>): Observable<HttpResponse<any>> {
    return this.http.put<any>(this.baseUrl + data.id, data);
  }

  deleteById(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(this.baseUrl + id);
  }

  isSkuAvailable(sku: string): Observable<boolean> {
    const url = this.baseUrl + 'sku-availability';
    return this.http.post<boolean>(url, { sku });
  }
}
