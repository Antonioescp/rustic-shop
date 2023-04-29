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
    const categoryUrl = `${this.url}${id}`;
    return this.http.get<Category>(categoryUrl);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.url + 'all');
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

  deleteCategory(id: number): Observable<HttpResponse<Response>> {
    const deleteUrl = `${this.url}${id}`;
    return this.http.delete<Response>(deleteUrl, { observe: 'response' });
  }

  updateCategory(category: Category): Observable<HttpResponse<any>> {
    const updateUrl = `${this.url}${category.id}`;
    return this.http.put<any>(updateUrl, category);
  }
}
