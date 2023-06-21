import { Injectable } from '@angular/core';
import { BaseCrudService } from '../shared/services/BaseCrudService';
import { ProductImage } from '../shared/models/ProductImage';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductImageService extends BaseCrudService<ProductImage, number> {
  constructor(http: HttpClient) {
    const resourceUrl = `${environment.apiBaseUrl}${environment.productImageEndpoint}`;
    super(resourceUrl, http);
  }
}
