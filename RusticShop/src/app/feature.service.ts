import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Feature from './shared/models/Feature';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  readonly featureUrl = `${environment.apiBaseUrl}${environment.featureEndpoint}`;

  constructor(
    private http: HttpClient
  ) { }

  addFeature(name: string): Observable<HttpResponse<Response>> {
    return this.http.post<Response>(this.featureUrl, { name }, { observe: 'response' });
  }

  getFeature(id: number): Observable<Feature> {
    const url = `${this.featureUrl}/${id}`;
    return this.http.get<Feature>(url);
  }

  getFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(this.featureUrl);
  }

  deleteFeature(id: number): Observable<HttpResponse<Response>> {
    const url = `${this.featureUrl}/${id}`;
    return this.http.delete<Response>(url, { observe: 'response' });
  }
}
