import { Injectable } from '@angular/core';
import Category from '../shared/models/Category';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatSort } from '@angular/material/sort';
import { BaseCrudService } from '../shared/services/BaseCrudService';

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
