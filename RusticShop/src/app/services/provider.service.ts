import { Injectable } from '@angular/core';
import { BaseCrudService } from '../shared/services/BaseCrudService';
import { HttpClient } from '@angular/common/http';
import { Provider } from '../shared/models/Provider';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProviderService extends BaseCrudService<Provider> {
  constructor(http: HttpClient) {
    const resourceUrl = `${environment.apiBaseUrl}${environment.providersEndpoint}`;
    super(resourceUrl, http);
  }
}
