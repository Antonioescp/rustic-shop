import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CustomerOrderService } from 'src/app/services/customer-order.service';
import {
  TableColumnDef,
  RowActionsDef,
  TableComponent,
  TableActionDef,
} from 'src/app/shared/components/table/table.component';
import { Order } from 'src/app/shared/models/Order';
import { OrderDetailsDto } from 'src/app/shared/models/dtos/orders/OrderDetailsDto';

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
        order.productCount.toLocaleString('es-NI'),
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
        order.total.toLocaleString('es-NI', {
          style: 'currency',
          currency: 'NIO',
        }),
    },
  ];

  actions: RowActionsDef<OrderDetailsDto>[] = [
    {
      color: 'primary',
      icon: 'visibility',
      tooltip: 'Ver',
      execute: (order: Order) => console.log(order),
    },
  ];

  displayedColumns = [...this.columns.map(c => c.def), 'actions'];

  fetchData(pageEvent: PageEvent) {
    this.orderService
      .getPaginatedOrderDetails(this.crud.getPagination(pageEvent))
      .subscribe(response => {
        this.crud.updateWithResults(response);
      });
  }

  constructor(public orderService: CustomerOrderService) {}

  ngAfterViewInit(): void {
    this.crud.loadData();
  }
}
