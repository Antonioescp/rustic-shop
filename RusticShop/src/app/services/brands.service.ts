import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import Brand from '../shared/models/Brand';
import { BrandWithProducts } from '../shared/models/dtos/brands/BrandWithProducts';
import { BaseCrudService } from '../shared/services/BaseCrudService';

@Injectable({
  providedIn: 'root',
})
export class BrandsService extends BaseCrudService<Brand> {
  constructor(http: HttpClient) {
    const brandsUrl = environment.apiBaseUrl + environment.brandsEndpoint;
    super(brandsUrl, http);
  }

  getAllWithProducts(): Observable<BrandWithProducts[]> {
    return this.http.get<BrandWithProducts[]>(
      this.resourceUrl + 'with-products'
    );
  }

  isNameAvailable(name: string): Observable<boolean> {
    const url = this.resourceUrl + 'name-availability';
    return this.http.post<boolean>(url, { name });
  }
}
