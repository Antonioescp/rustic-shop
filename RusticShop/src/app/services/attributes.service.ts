import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Attribute from '../shared/models/Attribute';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Pagination } from './categories.service';
import { CrudService } from '../shared/others/CrudService';
import { PaginatedResponse } from '../shared/models/dtos/PaginatedResponse';
import AttributeCreateDto from '../shared/models/dtos/attributes/AttributeCreateDto';

@Injectable({
  providedIn: 'root',
})
export class AttributesService
  implements CrudService<Attribute>
{
  readonly attributesUrl = `${environment.apiBaseUrl}${environment.attributesEndpoint}`;

  constructor(private http: HttpClient) {}

  create(data: AttributeCreateDto): Observable<HttpResponse<any>> {
    return this.http.post<Response>(this.attributesUrl, data, {
      observe: 'response',
    });
  }

  getById(id: number): Observable<Attribute> {
    const url = `${this.attributesUrl}/${id}`;
    return this.http.get<Attribute>(url);
  }

  getAll(): Observable<Attribute[]> {
    return this.http.get<Attribute[]>(this.attributesUrl + 'all');
  }

  getPaginated(
    pagination: Pagination
  ): Observable<PaginatedResponse<Attribute>> {
    const url = `${environment.apiBaseUrl}${environment.attributesEndpoint}`;
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

  deleteById(id: number): Observable<HttpResponse<any>> {
    const url = `${this.attributesUrl}/${id}`;
    return this.http.delete<Response>(url, { observe: 'response' });
  }

  update(attribute: Attribute): Observable<HttpResponse<any>> {
    const url = `${this.attributesUrl}${attribute.id}`;
    return this.http.put<any>(url, attribute);
  }

  isNameUnique(name: string): Observable<boolean> {
    const url = `${this.attributesUrl}name-availability`;
    return this.http.post<boolean>(url, { name });
  }
}
