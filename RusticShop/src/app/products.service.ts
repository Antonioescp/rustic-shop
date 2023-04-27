import { Injectable } from '@angular/core';
import VProductList from './shared/models/VProductList';
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

  getProductListView(): Observable<VProductList[]> {
    const url = `${environment.apiBaseUrl}${environment.productListViewEndpoint}`;
    return this.http.get<VProductList[]>(url);
  }
}
