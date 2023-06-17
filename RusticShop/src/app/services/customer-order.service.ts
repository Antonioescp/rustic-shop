import { Injectable } from '@angular/core';
import { BaseCrudService } from '../shared/services/BaseCrudService';
import { Order } from '../shared/models/Order';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Pagination } from './categories.service';
import { OrderDetailsDto } from '../shared/models/dtos/orders/OrderDetailsDto';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../shared/models/dtos/PaginatedResponse';

@Injectable({
  providedIn: 'root',
})
export class CustomerOrderService extends BaseCrudService<Order> {
  constructor(http: HttpClient) {
    const resourceUrl = `${environment.apiBaseUrl}${environment.ordersEndpoint}`;
    super(resourceUrl, http);
  }

  getPaginatedOrderDetails(
    pagination: Pagination
  ): Observable<PaginatedResponse<OrderDetailsDto>> {
    const url = `${this.resourceUrl}/summary/paginated`;
    return this.http.get<PaginatedResponse<OrderDetailsDto>>(url, {
      params: pagination.toHttpParams(),
    });
  }
}
