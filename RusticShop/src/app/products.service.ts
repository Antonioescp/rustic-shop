import { Injectable } from '@angular/core';
import VProductSummary from './shared/models/VProductSummary';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient
  ) {}

  getProductListView(): Observable<VProductSummary[]> {
    const url = `${environment.apiBaseUrl}${environment.productListViewEndpoint}`;
    return this.http.get<VProductSummary[]>(url);
  }
}
