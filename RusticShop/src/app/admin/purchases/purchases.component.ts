import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchaseService } from 'src/app/services/purchase.service';
import {
  CrudComponent,
  TableColumnDef,
} from 'src/app/shared/components/table/table.component';
import { Purchase } from 'src/app/shared/models/Purchase';
import { PurchaseEditDialogComponent } from './purchase-edit-dialog/purchase-edit-dialog.component';
import {
  BaseEditDialogData,
  BaseEditDialogResult,
} from 'src/app/shared/components/base-edit-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss'],
})
export class PurchasesComponent {
  @ViewChild(CrudComponent) crud!: CrudComponent<Purchase>;

  columns: TableColumnDef<Purchase>[] = [
    {
      def: 'id',
      header: 'ID',
      valueGetter: (purchase: Purchase) => purchase.id.toString(),
      sortable: true,
    },
    {
      def: 'date',
      header: 'Fecha',
      valueGetter: (purchase: Purchase) =>
        new Date(purchase.date).toLocaleDateString(),
      sortable: true,
    },
  ];

  displayedColumns = [...this.columns.map(c => c.def), 'actions'];

  constructor(
    public purchaseService: PurchaseService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  createResource(): void {
    const dialogRef = this.dialog.open<
      PurchaseEditDialogComponent,
      BaseEditDialogData<number>,
      BaseEditDialogResult<Purchase>
    >(PurchaseEditDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.crud.loadData();
        this.snackBar.open('Compra creada', 'OK', { duration: 2000 });
      }
    });
  }

  deleteResource(purchase: Purchase): void {
    const dialogRef = this.dialog.open<
      ConfirmDialogComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar compra',
        message: `¿Está seguro de que desea eliminar la compra con ID ${purchase.id}?`,
        cancelColor: 'primary',
        confirmColor: 'warn',
        cancelIcon: 'cancel',
        confirmIcon: 'warning',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.confirmed) {
        this.purchaseService.deleteById(purchase.id).subscribe(() => {
          this.crud.loadData();
          this.snackBar.open('Compra eliminada', 'OK', { duration: 2000 });
        });
      }
    });
  }

  editResource(purchase: Purchase): void {
    const dialogRef = this.dialog.open<
      PurchaseEditDialogComponent,
      BaseEditDialogData<number>,
      BaseEditDialogResult<Purchase>
    >(PurchaseEditDialogComponent, {
      data: { id: purchase.id },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        this.crud.loadData();
        this.snackBar.open('Compra actualizada', 'OK', { duration: 2000 });
      }
    });
  }
}
