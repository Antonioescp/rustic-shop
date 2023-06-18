import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DiscountsService } from 'src/app/services/discounts.service';
import Discount from 'src/app/shared/models/Discount';
import {
  BaseEditDialogData,
  BaseEditDialogResult,
} from '../../../shared/components/base-edit-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { DiscountEditDialogComponent } from '../discount-edit-dialog/discount-edit-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import {
  RowActionsDef,
  TableActionDef,
  TableColumnDef,
  TableComponent,
} from 'src/app/shared/components/table/table.component';

@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss'],
})
export class DiscountsComponent implements AfterViewInit {
  @ViewChild(TableComponent) table!: TableComponent<Discount>;

  columns: TableColumnDef<Discount>[] = [
    {
      def: 'id',
      header: 'ID',
      valueGetter: discount => discount.id.toString(),
      sortable: true,
    },
    {
      def: 'name',
      header: 'Nombre',
      valueGetter: discount => discount.name,
      sortable: true,
    },
    {
      def: 'description',
      header: 'Descripción',
      valueGetter: discount => discount.description,
      sortable: true,
    },
  ];

  displayedColumns = [...this.columns.map(c => c.def), 'actions'];

  tableActions: TableActionDef[] = [
    {
      label: 'Agregar descuento',
      icon: 'add',
      execute: () => this.onCreateDiscount(),
      color: 'primary',
    },
  ];

  rowActions: RowActionsDef<Discount>[] = [
    {
      icon: 'edit',
      execute: discount => this.onUpdateDiscount(discount.id),
      tooltip: 'Editar',
      color: 'primary',
    },
    {
      icon: 'delete_forever',
      execute: discount => this.onDeleteDiscount(discount),
      tooltip: 'Eliminar',
      color: 'warn',
    },
  ];

  constructor(
    private discountsService: DiscountsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.table.loadData();
  }

  fetchData(pageEvent: PageEvent) {
    this.discountsService
      .getPaginated(this.table.getPagination(pageEvent))
      .subscribe({
        next: result => {
          this.table.updateWithResults(result);
        },
        error: error => {
          console.error(error);
        },
      });
  }

  onDeleteDiscount(discount: Discount): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
      data: {
        title: `Eliminar el descuento ${discount.name}`,
        message: `¿Está seguro de que desea eliminar el descuento "${discount.name}"?`,
        confirmColor: 'warn',
        confirmIcon: 'warning',
        cancelColor: 'primary',
        cancelIcon: 'cancel',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.deleteDiscount(discount);
      }
    });
  }

  deleteDiscount(discount: Discount) {
    this.discountsService.deleteById(discount.id).subscribe({
      next: () => {
        this.table.loadData();
        this.snackBar.open(`Descuento "${discount.name}" eliminado con éxito.`);
      },
      error: error => {
        console.error(error);
        this.snackBar.open(
          `Descuento "${discount.name}" no pudo ser eliminado.`
        );
      },
    });
  }

  onCreateDiscount(): void {
    const dialogRef = this.dialog.open<
      DiscountEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Discount>
    >(DiscountEditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.table.loadData();
        this.snackBar.open(
          `Descuento "${result.resource.name}" creado con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(
          `Descuento "${result.resource.name}" no pudo ser creado.`
        );
      }
    });
  }

  onUpdateDiscount(id: number): void {
    const dialogRef = this.dialog.open<
      DiscountEditDialogComponent,
      BaseEditDialogData,
      BaseEditDialogResult<Discount>
    >(DiscountEditDialogComponent, {
      data: { id },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.table.loadData();
        this.snackBar.open(
          `Descuento "${result.resource.name}" actualizado con éxito.`
        );
      } else if (result?.success == false) {
        this.snackBar.open(
          `Descuento "${result.resource.name}" no pudo ser actualizado.`
        );
      }
    });
  }
}
