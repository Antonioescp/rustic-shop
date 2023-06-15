import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Discount from '../shared/models/Discount';
import { BaseCrudService } from '../shared/services/BaseCrudService';

@Injectable({
  providedIn: 'root',
})
export class DiscountsService extends BaseCrudService<Discount> {
  constructor(http: HttpClient) {
    const discountsUrl = `${environment.apiBaseUrl}${environment.discountsEndpoint}`;
    super(discountsUrl, http);
  }
}
