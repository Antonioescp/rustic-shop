import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { CustomerOrderService } from 'src/app/services/customer-order.service';
import {
  TableColumnDef,
  RowActionsDef,
  TableComponent,
} from 'src/app/shared/components/table/table.component';
import { Order } from 'src/app/shared/models/Order';
import { OrderDetailsDto } from 'src/app/shared/models/dtos/orders/OrderDetailsDto';
import {
  OrderSummaryDialogComponent,
  OrderSummaryDialogData,
  OrderSummaryDialogResult,
} from './order-summary-dialog/order-summary-dialog.component';
import { ReportServiceService } from 'src/app/services/report-service.service';

@Component({
  selector: 'app-sales-table',
  templateUrl: './sales-table.component.html',
  styleUrls: ['./sales-table.component.scss'],
})
export class SalesTableComponent implements AfterViewInit {
  @ViewChild(TableComponent) crud!: TableComponent<OrderDetailsDto>;

  columns: TableColumnDef<OrderDetailsDto>[] = [
    {
      def: 'id',
      header: 'ID',
      valueGetter: (order: OrderDetailsDto) => order.id.toString(),
      sortable: true,
    },
    {
      def: 'userFullName',
      header: 'Cliente',
      valueGetter: (order: OrderDetailsDto) => order.userFullName,
    },
    {
      def: 'status',
      header: 'Estado',
      valueGetter: (order: OrderDetailsDto) => order.status,
    },
    {
      def: 'productCount',
      header: 'Productos',
      valueGetter: (order: OrderDetailsDto) =>
        order.productCount?.toLocaleString('es-NI') ?? 'No aplicable',
    },
    {
      def: 'date',
      header: 'Fecha',
      valueGetter: (order: OrderDetailsDto) =>
        new Date(order.date).toLocaleDateString(),
      sortable: true,
    },
    {
      def: 'total',
      header: 'Total',
      valueGetter: (order: OrderDetailsDto) =>
        order.total?.toLocaleString('es-NI', {
          style: 'currency',
          currency: 'NIO',
        }) ?? 'No aplicable',
    },
  ];

  actions: RowActionsDef<OrderDetailsDto>[] = [
    {
      color: 'primary',
      icon: 'visibility',
      tooltip: 'Ver detalles',
      execute: (order: Order) => this.onViewOrderSummary(order.id),
    },
    {
      color: 'accent',
      icon: 'receipt_long',
      tooltip: 'Generar reporte',
      execute: (order: Order) => this.generateReport(order.id),
    },
  ];

  displayedColumns = [...this.columns.map(c => c.def), 'actions'];

  constructor(
    public orderService: CustomerOrderService,
    private dialog: MatDialog,
    private reportService: ReportServiceService
  ) {}

  ngAfterViewInit(): void {
    this.fetchData({ pageIndex: 0, pageSize: 5, length: 0 });
  }

  fetchData(pageEvent: PageEvent) {
    this.orderService
      .getPaginatedOrderDetails(this.crud.getPagination(pageEvent))
      .subscribe(response => {
        this.crud.updateWithResults(response);
      });
  }

  onViewOrderSummary(orderId: number): void {
    const dialogRef = this.dialog.open<
      OrderSummaryDialogComponent,
      OrderSummaryDialogData,
      OrderSummaryDialogResult
    >(OrderSummaryDialogComponent, {
      data: { orderId },
    });

    // TODO: listen to dialog close event
  }

  generateReport(orderId: number): void {
    this.reportService.getOrderSummaryReport(orderId).subscribe(data => {
      const blob = new Blob([data], { type: 'application/pdf' });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `Resumen de orden #${orderId}.pdf`;
      link.click();
    });
  }
}
