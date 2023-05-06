import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Feature from './shared/models/Feature';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Pagination } from './categories.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  readonly featureUrl = `${environment.apiBaseUrl}${environment.featureEndpoint}`;

  constructor(private http: HttpClient) {}

  addFeature(name: string): Observable<HttpResponse<Response>> {
    return this.http.post<Response>(
      this.featureUrl,
      { name },
      { observe: 'response' }
    );
  }

  getFeature(id: number): Observable<Feature> {
    const url = `${this.featureUrl}/${id}`;
    return this.http.get<Feature>(url);
  }

  getFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(this.featureUrl + 'all');
  }

  getPaginatedFeatures(pagination: Pagination): Observable<any> {
    const url = `${environment.apiBaseUrl}${environment.featureEndpoint}`;
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

  deleteFeature(id: number): Observable<HttpResponse<Response>> {
    const url = `${this.featureUrl}/${id}`;
    return this.http.delete<Response>(url, { observe: 'response' });
  }

  updateFeature(feature: Feature): Observable<HttpResponse<any>> {
    const url = `${this.featureUrl}${feature.id}`;
    return this.http.put<any>(url, feature);
  }

  isNameUnique(name: string): Observable<boolean> {
    const url = `${this.featureUrl}name-availability`;
    return this.http.post<boolean>(url, { featureName: name });
  }
}
