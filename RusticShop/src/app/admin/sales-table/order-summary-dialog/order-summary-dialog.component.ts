import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CustomerOrderService } from 'src/app/services/customer-order.service';
import { TableColumnDef } from 'src/app/shared/components/table/table.component';
import { Order } from 'src/app/shared/models/Order';
import { OrderSummaryDetailDto } from 'src/app/shared/models/dtos/orders/OrderSummaryDetailDto';
import { OrderSummaryDto } from 'src/app/shared/models/dtos/orders/OrderSummaryDto';

export interface OrderSummaryDialogData {
  orderId: number;
}

export interface OrderSummaryDialogResult {
  resource: Order;
  success: boolean;
  message?: string;
}

type TableColumnDefWithFooter<T> = TableColumnDef<T> & {
  getFooter?: (dataSource: T[]) => string;
};

@Component({
  selector: 'app-order-summary-dialog',
  templateUrl: './order-summary-dialog.component.html',
  styleUrls: ['./order-summary-dialog.component.scss'],
})
export class OrderSummaryDialogComponent implements OnInit {
  order?: OrderSummaryDto;

  get dataSource(): OrderSummaryDetailDto[] {
    return this.order?.orderDetails ?? [];
  }

  isBusy = false;

  columns: TableColumnDefWithFooter<OrderSummaryDetailDto>[] = [
    {
      def: 'id',
      header: 'ID',
      valueGetter: (orderDetail: OrderSummaryDetailDto) =>
        orderDetail.id.toLocaleString('es-NI'),
      getFooter: () => 'Total',
    },
    {
      def: 'productVariantSKU',
      header: 'SKU',
      valueGetter: (orderDetail: OrderSummaryDetailDto) =>
        orderDetail.productVariantSKU,
    },
    {
      def: 'quantity',
      header: 'Cantidad',
      valueGetter: (orderDetail: OrderSummaryDetailDto) =>
        orderDetail.quantity.toLocaleString('es-NI'),
      getFooter: (dataSource: OrderSummaryDetailDto[]) =>
        dataSource
          .reduce((acc, curr) => acc + curr.quantity, 0)
          .toLocaleString('es-NI'),
    },
    {
      def: 'unitPrice',
      header: 'Precio unitario',
      valueGetter: (orderDetail: OrderSummaryDetailDto) =>
        orderDetail.unitPrice.toLocaleString('es-NI', {
          style: 'currency',
          currency: 'NIO',
        }),
      getFooter: (dataSource: OrderSummaryDetailDto[]) =>
        dataSource
          .reduce((acc, od) => acc + od.unitPrice, 0)
          .toLocaleString('es-NI', {
            style: 'currency',
            currency: 'NIO',
          }),
    },
    {
      def: 'total',
      header: 'Total',
      valueGetter: (orderDetail: OrderSummaryDetailDto) =>
        orderDetail.total.toLocaleString('es-NI', {
          style: 'currency',
          currency: 'NIO',
        }),
      getFooter: (dataSource: OrderSummaryDetailDto[]) =>
        dataSource
          .reduce((acc, od) => acc + od.total, 0)
          .toLocaleString('es-NI', {
            style: 'currency',
            currency: 'NIO',
          }),
    },
  ];

  displayedColumns = this.columns.map(c => c.def);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: OrderSummaryDialogData,
    private dialogRef: MatDialogRef<
      OrderSummaryDialogComponent,
      OrderSummaryDialogResult
    >,
    private orderService: CustomerOrderService
  ) {}

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder(): void {
    this.isBusy = true;
    this.orderService.getOrderSummaryById(this.data.orderId).subscribe({
      next: order => {
        this.isBusy = false;
        this.order = order;
      },
      error: err => {
        this.isBusy = false;
        console.error(err);
      },
    });
  }
}
