import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportServiceService {
  readonly resourceUrl: string;

  constructor(private http: HttpClient) {
    this.resourceUrl = `${environment.apiBaseUrl}${environment.reportsEndpoint}`;
  }

  getOrderSummaryReport(orderId: number) {
    return this.http.get(`${this.resourceUrl}orders/${orderId}/summary`, {
      responseType: 'blob',
    });
  }
}
