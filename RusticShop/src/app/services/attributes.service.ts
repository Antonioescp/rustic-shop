import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Attribute from '../shared/models/Attribute';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { BaseCrudService } from '../shared/services/BaseCrudService';

@Injectable({
  providedIn: 'root',
})
export class AttributesService extends BaseCrudService<Attribute> {
  constructor(http: HttpClient) {
    const attributesUrl = `${environment.apiBaseUrl}${environment.attributesEndpoint}`;
    super(attributesUrl, http);
  }

  isNameUnique(name: string): Observable<boolean> {
    const url = `${this.resourceUrl}name-availability`;
    return this.http.post<boolean>(url, { name });
  }
}
