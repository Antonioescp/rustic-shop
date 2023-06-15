import { Injectable } from '@angular/core';
import Category from '../shared/models/Category';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { CrudService } from '../shared/services/CrudService';
import { PaginatedResponse } from '../shared/models/dtos/PaginatedResponse';

export interface Pagination {
  pageIndex: number;
  pageSize: number;
  defaultSortColumn: string;
  defaultSortOrder: 'asc' | 'desc';
  defaultFilterColumn: string;
  filterQuery?: string;
  sort?: MatSort;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService implements CrudService<Category> {
  readonly url = `${environment.apiBaseUrl}${environment.categoryEndpoint}`;

  constructor(private http: HttpClient) {}

  getById(id: number): Observable<Category> {
    const categoryUrl = `${this.url}${id}`;
    return this.http.get<Category>(categoryUrl);
  }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url + 'all');
  }

  getPaginated(
    pagination: Pagination
  ): Observable<PaginatedResponse<Category>> {
    const url = `${environment.apiBaseUrl}${environment.categoryEndpoint}`;
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
    return this.http.get<any>(url, { params });
  }

  create(category: Category): Observable<HttpResponse<any>> {
    return this.http.post<Response>(this.url, category, {
      observe: 'response',
    });
  }

  deleteById(id: number): Observable<HttpResponse<any>> {
    const deleteUrl = `${this.url}${id}`;
    return this.http.delete<Response>(deleteUrl, { observe: 'response' });
  }

  update(category: Category): Observable<HttpResponse<any>> {
    const updateUrl = `${this.url}${category.id}`;
    return this.http.put<any>(updateUrl, category);
  }

  checkNameUniqueness(name: string): Observable<boolean> {
    const url = `${this.url}name-availability`;
    return this.http.post<boolean>(url, { name });
  }
}
