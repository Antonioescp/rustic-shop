import { Injectable } from '@angular/core';
import Category from './shared/models/Category';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';

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
  providedIn: 'root'
})
export class CategoriesService {

  readonly url = `${environment.apiBaseUrl}${environment.categoryEndpoint}`;

  constructor(
    private http: HttpClient
  ) { }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(this.url);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url);
  }

  getPaginatedCategories(pagination: Pagination): Observable<any> {
    const url = `${environment.apiBaseUrl}${environment.categoryEndpoint}`;
    let params = new HttpParams()
      .set('pageIndex', pagination.pageIndex)
      .set('pageSize', pagination.pageSize)
      .set('sortColumn', (pagination.sort)
        ? pagination.sort.active
        : pagination.defaultSortColumn)
      .set('sortOrder', (pagination.sort)
        ? pagination.sort.direction
        : pagination.defaultSortOrder);

    if (pagination.filterQuery) {
      params = params
        .set('filterColumn', pagination.defaultFilterColumn)
        .set('filterQuery', pagination.filterQuery);
    }
    return this.http.get<any>(url, { params });
  }

  addCategory(name: string): Observable<HttpResponse<Response>> {
    return this.http.post<Response>(this.url, { name }, { observe: 'response' });
  }

  deleteCategory(name: string): Observable<HttpResponse<Response>> {
    return this.http.delete<Response>(this.url, { observe: 'response' });
  }
}
