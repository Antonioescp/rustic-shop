import { Injectable } from '@angular/core';
import Category from '../shared/models/Category';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { BaseCrudService } from '../shared/services/BaseCrudService';

export class Pagination {
  pageIndex = 0;
  pageSize = 10;
  defaultSortColumn = 'id';
  defaultSortOrder: 'asc' | 'desc' = 'asc';
  defaultFilterColumn = '';
  filterQuery?: string;
  sort?: MatSort;

  constructor(init?: Partial<Pagination>) {
    Object.assign(this, init);
  }

  public toHttpParams(): HttpParams {
    let params = new HttpParams()
      .set('pageIndex', this.pageIndex)
      .set('pageSize', this.pageSize)
      .set('sortColumn', this.sort ? this.sort.active : this.defaultSortColumn)
      .set(
        'sortOrder',
        this.sort ? this.sort.direction : this.defaultSortOrder
      );

    if (this.filterQuery) {
      params = params
        .set('filterColumn', this.defaultFilterColumn)
        .set('filterQuery', this.filterQuery);
    }

    return params;
  }
}

@Injectable({
  providedIn: 'root',
})
export class CategoriesService extends BaseCrudService<Category> {
  constructor(http: HttpClient) {
    const categoriesUrl = `${environment.apiBaseUrl}${environment.categoryEndpoint}`;
    super(categoriesUrl, http);
  }

  checkNameUniqueness(name: string): Observable<boolean> {
    const url = `${this.resourceUrl}name-availability`;
    return this.http.post<boolean>(url, { name });
  }
}
