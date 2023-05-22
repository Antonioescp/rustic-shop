import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import Brand from '../shared/models/Brand';
import { Pagination } from './categories.service';
import { BrandDto } from '../shared/models/dtos/brands/CreateBrandDto';
import { CrudService } from '../shared/others/CrudService';
import { PaginatedResponse } from '../shared/models/dtos/PaginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class BrandsService implements CrudService<Brand> {
  readonly brandsUrl = environment.apiBaseUrl + environment.brandsEndpoint;

  constructor(private http: HttpClient) {}

  getPaginated(pagination: Pagination): Observable<PaginatedResponse<Brand>> {
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

    return this.http.get<any>(this.brandsUrl, { params });
  }

  getById(id: number): Observable<Brand> {
    const url = `${this.brandsUrl}${id}`;
    return this.http.get<Brand>(url);
  }

  getAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.brandsUrl + 'all');
  }

  deleteById(id: number): Observable<HttpResponse<any>> {
    const url = this.brandsUrl + id;
    return this.http.delete<any>(url);
  }

  create(newBrand: BrandDto): Observable<HttpResponse<any>> {
    return this.http.post<any>(this.brandsUrl, newBrand);
  }

  update(brand: Brand): Observable<HttpResponse<any>> {
    const url = this.brandsUrl + brand.id;
    return this.http.put<any>(url, brand);
  }

  isNameAvailable(name: string): Observable<boolean> {
    const url = this.brandsUrl + 'name-availability';
    return this.http.post<boolean>(url, { name });
  }
}
