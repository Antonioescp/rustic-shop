import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import Brand from './shared/models/Brand';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  readonly brandsUrl = environment.apiBaseUrl + environment.brandsEndpoint;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.brandsUrl);
  }
}
