import { Injectable } from '@angular/core';
import { BaseCrudService } from '../shared/services/BaseCrudService';
import { Purchase } from '../shared/models/Purchase';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService extends BaseCrudService<Purchase> {
  constructor(http: HttpClient) {
    const resourceUrl = `${environment.apiBaseUrl}${environment.purchasesEndpoint}`;
    super(resourceUrl, http);
  }
}
