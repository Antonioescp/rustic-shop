import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Discount from '../shared/models/Discount';
import { CrudService } from '../shared/others/CrudService';
import { Pagination } from './categories.service';
import { PaginatedResponse } from '../shared/models/dtos/PaginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class DiscountsService implements CrudService<Discount> {
  readonly discountsUrl = `${environment.apiBaseUrl}${environment.discountsEndpoint}`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Discount> {
    return this.http.get<Discount>(this.discountsUrl + id);
  }

  getAll(): Observable<Discount[]> {
    return this.http.get<Discount[]>(this.discountsUrl + 'all');
  }

  getPaginated(
    pagination: Pagination
  ): Observable<PaginatedResponse<Discount>> {
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
    return this.http.get<any>(this.discountsUrl, { params });
  }

  create(discount: Omit<Discount, 'id'>): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.discountsUrl, discount);
  }

  update(discount: Discount): Observable<HttpResponse<any>> {
    const discountUrl = `${this.discountsUrl}${discount.id}`;
    return this.http.put<any>(discountUrl, discount, { observe: 'response' });
  }

  deleteById(id: number): Observable<HttpResponse<any>> {
    const discountUrl = `${this.discountsUrl}${id}`;
    return this.http.delete<any>(discountUrl);
  }
}
